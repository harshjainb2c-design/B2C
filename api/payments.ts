import { VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { verifyAuth, AuthenticatedRequest } from './_middleware/auth';
import { getRazorpayConfig, getShiprocketConfig } from './_lib/settings';
import { createShiprocketCodShipment } from './_lib/shiprocket';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || 'config';

  if (action === 'config') {
    const razorpayConfig = await getRazorpayConfig();
    const shiprocketConfig = await getShiprocketConfig();

    return res.status(200).json({
      razorpay: {
        keyId: razorpayConfig.keyId,
        enabled: razorpayConfig.enabled && Boolean(razorpayConfig.keyId && razorpayConfig.keySecret),
      },
      shiprocket: {
        enabled: shiprocketConfig.enabled && Boolean(shiprocketConfig.email && shiprocketConfig.password),
      },
      codEnabled: true,
    });
  }

  const isAuthed = await verifyAuth(req, res);
  if (!isAuthed || !req.user) {
    return;
  }

  if (action === 'create_order') {
    return await handleCreateRazorpayOrder(req, res);
  }

  if (action === 'verify') {
    return await handleVerifyRazorpayPayment(req, res);
  }

  return res.status(400).json({ error: { code: 'INVALID_ACTION', message: 'Unknown payment action' } });
}

async function handleCreateRazorpayOrder(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: { code: 'EMPTY_CART', message: 'Cart items required' } });
  }

  const config = await getRazorpayConfig();
  if (!config.keyId || !config.keySecret) {
    return res.status(500).json({ error: { code: 'PAYMENT_CONFIG_ERROR', message: 'Online payment gateway is currently unconfigured' } });
  }

  const productIds = items.map((i: any) => i.productId);
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds);

  if (productError || !products) {
    return res.status(500).json({ error: { code: 'DB_ERROR', message: 'Unable to verify catalog prices' } });
  }

  let total = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: { code: 'INVALID_PRODUCT', message: `Product ${item.productId} not found` } });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: { code: 'OUT_OF_STOCK', message: `${product.name} is out of stock` } });
    }
    total += product.price * item.quantity;
  }

  const amountInPaise = Math.round(total * 100);
  const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

  const authHeader = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');
  const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: req.user!.id,
      },
    }),
  });

  const orderData = await razorpayResponse.json();
  if (!razorpayResponse.ok || !orderData.id) {
    return res.status(500).json({ error: { code: 'GATEWAY_ERROR', message: orderData.error?.description || 'Failed to create payment order' } });
  }

  return res.status(200).json({
    razorpayOrderId: orderData.id,
    amount: orderData.amount,
    currency: orderData.currency,
    keyId: config.keyId,
    total,
  });
}

async function handleVerifyRazorpayPayment(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    items,
    shippingAddress,
  } = req.body || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !Array.isArray(items) || !shippingAddress) {
    return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: 'Missing required verification fields' } });
  }

  const config = await getRazorpayConfig();
  if (!config.keySecret) {
    return res.status(500).json({ error: { code: 'CONFIG_ERROR', message: 'Gateway secret missing' } });
  }

  const bodyToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.keySecret)
    .update(bodyToSign)
    .digest('hex');

  const isAuthentic = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpaySignature)
  );

  if (!isAuthentic) {
    return res.status(400).json({ error: { code: 'SIGNATURE_VERIFICATION_FAILED', message: 'Invalid payment signature' } });
  }

  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('payment_intent_id', razorpayPaymentId)
    .maybeSingle();

  if (existingOrder) {
    return res.status(200).json({ success: true, orderId: existingOrder.id });
  }

  const productIds = items.map((i: any) => i.productId);
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', productIds);

  const productMap = new Map((products || []).map((p) => [p.id, p]));
  let total = 0;
  const canonicalItems = items.map((item: any) => {
    const product = productMap.get(item.productId);
    const price = product ? product.price : 0;
    total += price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price,
      size: item.size || null,
      sku: `${item.productId.slice(0, 8)}-${item.size || 'STD'}`,
      product: product || { name: 'Item', price: 0 },
    };
  });

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: req.user!.id,
      items: canonicalItems,
      shipping_address: shippingAddress,
      total,
      status: 'processing',
      payment_method: 'online',
      payment_status: 'paid',
      payment_intent_id: razorpayPaymentId,
      fulfillment_status: 'pending_shipment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError || !order) {
    return res.status(500).json({ error: { code: 'DB_ERROR', message: 'Failed to record order' } });
  }

  for (const item of canonicalItems) {
    const { data: rpcSuccess, error: rpcError } = await supabase.rpc('decrement_product_stock', {
      p_product_id: item.productId,
      p_quantity: item.quantity,
    });
    if (rpcError || !rpcSuccess) {
      const currentProduct = productMap.get(item.productId);
      if (currentProduct) {
        const nextStock = Math.max(0, currentProduct.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: nextStock })
          .eq('id', item.productId);
      }
    }
  }

  try {
    await supabase.from('carts').update({
      items: [],
      updated_at: new Date().toISOString(),
    }).eq('user_id', req.user!.id);
  } catch {}

  const shiprocketConfig = await getShiprocketConfig();
  if (shiprocketConfig.enabled && shiprocketConfig.email && shiprocketConfig.password) {
    try {
      const shipment = await createShiprocketCodShipment({
        orderId: order.id,
        customerEmail: req.user!.email,
        shippingAddress,
        items: canonicalItems.map((item) => ({
          name: item.product.name,
          sku: item.sku,
          quantity: item.quantity,
          sellingPrice: item.price,
        })),
        total,
        paymentMethod: 'Prepaid',
      });

      await supabase.from('orders').update({
        fulfillment_status: 'shipment_created',
        shiprocket_order_id: shipment.orderId,
        shiprocket_shipment_id: shipment.shipmentId,
        updated_at: new Date().toISOString(),
      }).eq('id', order.id);
    } catch (err) {
      console.error('Shiprocket prepaid order creation error:', err);
    }
  }

  return res.status(201).json({ success: true, orderId: order.id });
}
