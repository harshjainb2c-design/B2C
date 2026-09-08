import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

  const { id, category, collection, search, page = '1', limit = '12' } = req.query;

  try {
    if (id) return await getProduct(res, id as string);
    return await getProducts(res, {
      category: category as string,
      collection: collection as string,
      search: search as string,
      page: page as string,
      limit: limit as string,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function getProduct(res: VercelResponse, id: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch product' }, status: 500 });
  }

  if (!product) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
  }

  return res.status(200).json({
    ...product,
    isActive: product.is_active,
    categories: product.categories || [],
    collection: product.collection || undefined,
  });
}

async function getProducts(res: VercelResponse, params: { category?: string; collection?: string; search?: string; page: string; limit: string }) {
  const pageNum = parseInt(params.page, 10);
  const limitNum = parseInt(params.limit, 10);

  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid pagination parameters' }, status: 400 });
  }

  const offset = (pageNum - 1) * limitNum;
  let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true);

  if (params.category) {
    query = query.or(`category.eq.${params.category},categories.cs.{${params.category}}`);
  }
  if (params.collection) {
    query = query.eq('collection', params.collection);
  }
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

  const { data: products, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Failed to fetch products' }, status: 500 });
  }

  const transformed = (products || []).map((p: any) => ({
    ...p,
    isActive: p.is_active,
    categories: p.categories || [],
    collection: p.collection || undefined,
  }));

  return res.status(200).json({
    products: transformed,
    total: count || 0,
    page: pageNum,
    totalPages: count ? Math.ceil(count / limitNum) : 0,
  });
}
