import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    if (req.method === 'POST') return await createOrder(req, res, user.id);

    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  } catch (error) {
    console.error('Unexpected error:', error);
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

async function createOrder(req: VercelRequest, res: VercelResponse, userId: string) {
  const { items, shippingAddress, paymentIntentId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !shippingAddress || !paymentIntentId) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Items, shipping address, and payment intent ID are required' }, status: 400 });
  }

  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const { data: order, error } = await supabase.from('orders').insert({
    user_id: userId,
    items,
    total,
    status: 'pending',
    shipping_address: shippingAddress,
    payment_intent_id: paymentIntentId,
  }).select().single();

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to create order' }, status: 500 });
  }

  return res.status(201).json(order);
}
