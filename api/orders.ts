import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createShiprocketCodShipment } from './_lib/shiprocket';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RequestItem {
  productId: string;
  quantity: number;
  size?: string;
}

interface RequestAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

async function getUserFromAuth(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error || !user ? null : user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getUserFromAuth(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' }, status: 401 });
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET' && id) return await getOrder(res, user.id, id as string);
    if (req.method === 'GET') return await getOrders(res, user.id);
    if (req.method === 'POST') return await createOrder(req, res, user.id, user.email);

    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  } catch (error) {
    console.error('Unexpected order API error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function getOrders(res: VercelResponse, userId: string) {
  const { data: orders, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch orders' }, status: 500 });
  }

  return res.status(200).json({ orders: orders || [], total: orders?.length || 0 });
}

async function getOrder(res: VercelResponse, userId: string, orderId: string) {
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).eq('user_id', userId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' }, status: 404 });
    }
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch order' }, status: 500 });
  }

  return res.status(200).json(order);
}

const isValidAddress = (address: unknown): address is RequestAddress => {
  if (!address || typeof address !== 'object') return false;
  const value = address as Record<string, unknown>;
  return ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phone']
    .every((field) => typeof value[field] === 'string' && value[field].trim().length > 0);
};

async function createOrder(req: VercelRequest, res: VercelResponse, userId: string, customerEmail?: string) {
  const { items, shippingAddress, paymentMethod } = req.body as {
    items?: RequestItem[];
    shippingAddress?: RequestAddress;
    paymentMethod?: string;
  };

  if (!Array.isArray(items) || items.length === 0 || !isValidAddress(shippingAddress) || paymentMethod !== 'cod') {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Valid items, shipping address, and COD payment method are required' },
      status: 400,
    });
  }

  const requestedItems = items.filter((item) =>
    typeof item.productId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0
  );
  const productIds = [...new Set(requestedItems.map((item) => item.productId))];

  if (requestedItems.length !== items.length || productIds.length !== items.length) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Each product may appear only once with a positive quantity' }, status: 400 });
  }

  // Prices and products come from the database, never from the browser.
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('is_active', true);

  if (productsError || !products || products.length !== productIds.length) {
    return res.status(400).json({ error: { code: 'NOT_FOUND', message: 'One or more products are no longer available' }, status: 400 });
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const unavailableProduct = requestedItems
    .map((item) => ({ product: productsById.get(item.productId)!, quantity: item.quantity }))
    .find(({ product, quantity }) => product.stock < quantity);

  if (unavailableProduct) {
    return res.status(400).json({
      error: { code: 'INSUFFICIENT_STOCK', message: `${unavailableProduct.product.name} does not have enough stock` },
      status: 400,
    });
  }

  const canonicalItems = requestedItems.map((item) => {
    const product = productsById.get(item.productId)!;

    return {
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        categories: product.categories,
        collection: product.collection,
        images: product.images || [],
        stock: product.stock,
        isActive: product.is_active,
        specifications: product.specifications || {},
        sizes: product.sizes,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      quantity: item.quantity,
      price: Number(product.price),
      size: item.size,
      sku: product.sku || product.id,
    };
  });

  const total = canonicalItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const persistedItems = canonicalItems.map(({ sku: _sku, ...item }) => item);

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: userId,
    items: persistedItems,
    total,
    status: 'pending',
    shipping_address: shippingAddress,
    payment_intent_id: null,
    payment_method: 'cod',
    payment_status: 'pending_collection',
    fulfillment_status: 'pending',
  }).select().single();

  if (orderError || !order) {
    console.error('Order creation error:', orderError);
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to create order' }, status: 500 });
  }

  try {
    const shipment = await createShiprocketCodShipment({
      orderId: order.id,
      customerEmail,
      shippingAddress,
      items: canonicalItems.map((item) => ({
        name: item.product.name,
        sku: item.sku,
        quantity: item.quantity,
        sellingPrice: item.price,
      })),
      total,
    });

    const { data: updatedOrder, error: shipmentUpdateError } = await supabase.from('orders').update({
      status: 'processing',
      fulfillment_status: 'shipment_created',
      shiprocket_order_id: shipment.orderId,
      shiprocket_shipment_id: shipment.shipmentId,
      updated_at: new Date().toISOString(),
    }).eq('id', order.id).select().single();

    if (shipmentUpdateError || !updatedOrder) {
      console.error('Shiprocket shipment persistence error:', shipmentUpdateError);
      return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Shipment was created but could not be saved locally' }, status: 500 });
    }

    return res.status(201).json(updatedOrder);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Shiprocket shipment';
    await supabase.from('orders').update({
      fulfillment_status: 'failed',
      updated_at: new Date().toISOString(),
    }).eq('id', order.id);

    console.error('Shiprocket order creation error:', error);
    return res.status(502).json({ error: { code: 'EXTERNAL_SERVICE_ERROR', message }, status: 502 });
  }
}
