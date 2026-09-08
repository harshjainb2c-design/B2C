import { VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, AuthenticatedRequest } from './_middleware/auth';
import { getRazorpayConfig, getShiprocketConfig, maskSecret } from './_lib/settings';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const isAdmin = await verifyAdmin(req, res);
  if (!isAdmin) {
    return;
  }

  const { resource, id } = req.query;

  try {
    if (resource === 'orders') {
      if (req.method === 'GET') return await getOrders(req, res);
      if (req.method === 'PUT' || req.method === 'PATCH') return await updateOrderStatus(req, res, id as string);
    } else if (resource === 'products') {
      if (req.method === 'GET') return await getAdminProducts(req, res);
      if (req.method === 'POST') return await createProduct(req, res);
      if (req.method === 'PUT' || req.method === 'PATCH') return await updateProduct(req, res, id as string);
      if (req.method === 'DELETE') return await deleteProduct(req, res, id as string);
    } else if (resource === 'settings') {
      if (req.method === 'GET') return await getSettings(res);
      if (req.method === 'POST' || req.method === 'PUT') return await updateSettings(req, res);
    }

    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function getSettings(res: VercelResponse) {
  const razorpay = await getRazorpayConfig();
  const shiprocket = await getShiprocketConfig();

  return res.status(200).json({
    razorpay: {
      keyId: razorpay.keyId,
      keySecret: maskSecret(razorpay.keySecret),
      hasSecret: Boolean(razorpay.keySecret),
      enabled: razorpay.enabled,
    },
    shiprocket: {
      email: shiprocket.email,
      password: maskSecret(shiprocket.password),
      hasPassword: Boolean(shiprocket.password),
      pickupLocation: shiprocket.pickupLocation,
      webhookSecret: maskSecret(shiprocket.webhookSecret),
      enabled: shiprocket.enabled,
    },
  });
}

async function updateSettings(req: AuthenticatedRequest, res: VercelResponse) {
  const { razorpay, shiprocket } = req.body || {};

  if (razorpay) {
    const current = await getRazorpayConfig();
    const finalSecret = razorpay.keySecret && !razorpay.keySecret.includes('******')
      ? razorpay.keySecret
      : current.keySecret;

    const payload = {
      keyId: razorpay.keyId !== undefined ? razorpay.keyId : current.keyId,
      keySecret: finalSecret,
      enabled: razorpay.enabled !== undefined ? Boolean(razorpay.enabled) : current.enabled,
    };

    await supabase.from('store_settings').upsert({
      key: 'razorpay',
      value: payload,
      updated_at: new Date().toISOString(),
    });
  }

  if (shiprocket) {
    const current = await getShiprocketConfig();
    const finalPassword = shiprocket.password && !shiprocket.password.includes('******')
      ? shiprocket.password
      : current.password;

    const finalWebhookSecret = shiprocket.webhookSecret && !shiprocket.webhookSecret.includes('******')
      ? shiprocket.webhookSecret
      : current.webhookSecret;

    const payload = {
      email: shiprocket.email !== undefined ? shiprocket.email : current.email,
      password: finalPassword,
      pickupLocation: shiprocket.pickupLocation !== undefined ? shiprocket.pickupLocation : current.pickupLocation,
      webhookSecret: finalWebhookSecret,
      enabled: shiprocket.enabled !== undefined ? Boolean(shiprocket.enabled) : current.enabled,
    };

    await supabase.from('store_settings').upsert({
      key: 'shiprocket',
      value: payload,
      updated_at: new Date().toISOString(),
    });
  }

  return res.status(200).json({ success: true });
}

async function getOrders(req: AuthenticatedRequest, res: VercelResponse) {
  const { status, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  let query = supabase.from('orders').select('*', { count: 'exact' });

  if (status && typeof status === 'string') {
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid order status' }, status: 400 });
    }
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);
  const { data: orders, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch orders' }, status: 500 });
  }

  return res.status(200).json({ orders: orders || [], total: count || 0, page: pageNum, totalPages: count ? Math.ceil(count / limitNum) : 0 });
}

async function getAdminProducts(req: AuthenticatedRequest, res: VercelResponse) {
  const { category, search, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const offset = (pageNum - 1) * limitNum;

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (category && typeof category === 'string') {
    query = query.or(`category.eq.${category},categories.cs.{${category}}`);
  }
  if (search && typeof search === 'string') {
    query = query.ilike('name', `%${search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);
  const { data: products, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch products' }, status: 500 });
  }

  return res.status(200).json({ products: products || [], total: count || 0, page: pageNum, totalPages: count ? Math.ceil(count / limitNum) : 0 });
}

async function updateOrderStatus(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Order ID is required' }, status: 400 });
  }

  const { status, fulfillment_status, tracking_status, awb_code, courier_name } = req.body || {};

  const updateData: any = { updated_at: new Date().toISOString() };
  if (status) {
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid order status' }, status: 400 });
    }
    updateData.status = status;
  }
  if (fulfillment_status !== undefined) updateData.fulfillment_status = fulfillment_status;
  if (tracking_status !== undefined) updateData.tracking_status = tracking_status;
  if (awb_code !== undefined) updateData.awb_code = awb_code;
  if (courier_name !== undefined) updateData.courier_name = courier_name;

  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to update order status' }, status: 500 });
  }

  return res.status(200).json(order);
}

async function createProduct(req: AuthenticatedRequest, res: VercelResponse) {
  const { name, description, price, category, categories, collection, images, sizes, stock, is_active, isActive } = req.body || {};

  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Name and price are required' }, status: 400 });
  }

  const activeValue = is_active !== undefined ? is_active : (isActive !== undefined ? isActive : true);

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || '',
      price,
      category: category || 'Streetwear',
      categories: categories || (category ? [category] : ['Streetwear']),
      collection: collection || null,
      images: images || [],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      stock: stock || 0,
      is_active: activeValue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to create product' }, status: 500 });
  }

  return res.status(201).json(product);
}

async function updateProduct(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, status: 400 });
  }

  const { name, description, price, category, categories, collection, images, sizes, stock, is_active, isActive } = req.body || {};

  const updateData: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (category !== undefined) {
    updateData.category = category;
    if (!categories) updateData.categories = [category];
  }
  if (categories !== undefined) updateData.categories = categories;
  if (collection !== undefined) updateData.collection = collection;
  if (images !== undefined) updateData.images = images;
  if (sizes !== undefined) updateData.sizes = sizes;
  if (stock !== undefined) updateData.stock = stock;
  if (is_active !== undefined) updateData.is_active = is_active;
  if (isActive !== undefined) updateData.is_active = isActive;

  const { data: product, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to update product' }, status: 500 });
  }

  return res.status(200).json(product);
}

async function deleteProduct(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, status: 400 });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to delete product' }, status: 500 });
  }

  return res.status(200).json({ message: 'Product deleted successfully' });
}
