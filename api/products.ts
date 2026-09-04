import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

  const { id, category, search, page = '1', limit = '12' } = req.query;

  try {
    if (id) return await getProduct(res, id as string);
    return await getProducts(res, { category: category as string, search: search as string, page: page as string, limit: limit as string });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function getProduct(res: VercelResponse, id: string) {
  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
    }
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch product' }, status: 500 });
  }

  return res.status(200).json(product);
}

async function getProducts(res: VercelResponse, params: { category?: string; search?: string; page: string; limit: string }) {
  const pageNum = parseInt(params.page, 10);
  const limitNum = parseInt(params.limit, 10);

  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid pagination parameters' }, status: 400 });
  }

  const offset = (pageNum - 1) * limitNum;
  let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true);

  if (params.category) query = query.eq('category', params.category);
  if (params.search) query = query.ilike('name', `%${params.search}%`);

  query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

  const { data: products, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch products' }, status: 500 });
  }

  return res.status(200).json({ products: products || [], total: count || 0, page: pageNum, totalPages: count ? Math.ceil(count / limitNum) : 0 });
}
