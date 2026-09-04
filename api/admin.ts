import { VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, AuthenticatedRequest } from './_middleware/auth';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  console.log('=== ADMIN API HANDLER CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', req.query);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Admin API called:', { method: req.method, query: req.query, headers: req.headers.authorization ? 'present' : 'missing' });
  
  const isAdmin = await verifyAdmin(req, res);
  if (!isAdmin) {
    console.log('Admin verification failed');
    return;
  }

  const { resource, id } = req.query;
  console.log('Admin verified, resource:', resource, 'id:', id);

  try {
    if (resource === 'orders') {
      if (req.method === 'GET') return await getOrders(req, res);
      if (req.method === 'PUT') return await updateOrderStatus(req, res, id as string);
    } else if (resource === 'products') {
      if (req.method === 'POST') return await createProduct(req, res);
      if (req.method === 'PUT') return await updateProduct(req, res, id as string);
      if (req.method === 'DELETE') return await deleteProduct(req, res, id as string);
    }

    console.log('No matching route found for resource:', resource, 'method:', req.method);
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
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
    console.error('Database error:', error);
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch orders' }, status: 500 });
  }

  return res.status(200).json({ orders: orders || [], total: count || 0, page: pageNum, totalPages: count ? Math.ceil(count / limitNum) : 0 });
}

async function updateOrderStatus(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Order ID is required' }, status: 400 });
  }

  const { status } = req.body;
  if (!status || !VALID_ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid order status' }, status: 400 });
  }

  const { data: order, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' }, status: 404 });
    }
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to update order status' }, status: 500 });
  }

  return res.status(200).json(order);
}

async function createProduct(req: AuthenticatedRequest, res: VercelResponse) {
  console.log('createProduct called with body:', req.body);
  
  const { name, description, price, category, images, stock, isActive = true, specifications = {} } = req.body;

  if (!name || !description || price === undefined || !category || !images || stock === undefined) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' }, status: 400 });
  }

  if (typeof price !== 'number' || price < 0 || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock) || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid field values' }, status: 400 });
  }

  const { data: product, error } = await supabase.from('products').insert({ name, description, price, category, images, stock, is_active: isActive, specifications }).select().single();

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to create product', details: error.message }, status: 500 });
  }

  console.log('Product created successfully:', product);
  
  // Transform the response to match the Product type
  const transformedProduct = {
    ...product,
    isActive: product.is_active,
  };
  
  return res.status(201).json(transformedProduct);
}

async function updateProduct(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  console.log('updateProduct called with id:', id, 'body:', req.body);
  
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, status: 400 });
  }

  const { name, description, price, category, images, stock, isActive, specifications } = req.body;
  const updates: any = {};

  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid price' }, status: 400 });
    }
    updates.price = price;
  }
  if (category !== undefined) updates.category = category;
  if (images !== undefined) {
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid images' }, status: 400 });
    }
    updates.images = images;
  }
  if (stock !== undefined) {
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid stock' }, status: 400 });
    }
    updates.stock = stock;
  }
  if (isActive !== undefined) updates.is_active = isActive;
  if (specifications !== undefined) updates.specifications = specifications;

  console.log('Updates to apply:', updates);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'No fields to update' }, status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data: product, error } = await supabase.from('products').update(updates).eq('id', id).select().single();

  if (error) {
    console.error('Supabase error:', error);
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
    }
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to update product', details: error.message }, status: 500 });
  }

  console.log('Product updated successfully:', product);
  
  // Transform the response to match the Product type
  const transformedProduct = {
    ...product,
    isActive: product.is_active,
  };
  
  return res.status(200).json(transformedProduct);
}

async function deleteProduct(req: AuthenticatedRequest, res: VercelResponse, id: string) {
  console.log('deleteProduct called with id:', id);
  
  if (!id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Product ID is required' }, status: 400 });
  }

  const { data: product, error } = await supabase.from('products').delete().eq('id', id).select().single();

  if (error) {
    console.error('Supabase error:', error);
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
    }
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to delete product', details: error.message }, status: 500 });
  }

  console.log('Product deleted successfully:', product);
  
  return res.status(200).json({ message: 'Product deleted successfully', id });
}
