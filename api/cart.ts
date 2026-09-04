import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getUserFromAuth(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error || !user ? null : user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[Cart API] Request received:', { method: req.method, action: req.query.action });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

  try {
    const user = await getUserFromAuth(req.headers.authorization);
    if (!user) {
      console.log('[Cart API] Authentication failed');
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' }, status: 401 });
    }

    console.log('[Cart API] User authenticated:', user.id);
    const { action } = req.query;

    if (action === 'sync') return await syncCart(req, res, user.id);
    return await addToCart(req, res, user.id);
  } catch (error: any) {
    console.error('[Cart API] Unexpected error:', error);
    return res.status(500).json({ 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'An unexpected error occurred',
        details: error?.message || String(error)
      }, 
      status: 500 
    });
  }
}

async function addToCart(req: VercelRequest, res: VercelResponse, userId: string) {
  console.log('[Cart API] addToCart called for user:', userId);
  const { productId, quantity } = req.body;
  console.log('[Cart API] Request body:', { productId, quantity });

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid product ID and quantity required' }, status: 400 });
  }

  const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', productId).eq('is_active', true).single();

  if (productError) {
    console.error('[Cart API] Product fetch error:', productError);
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found', details: productError.message }, status: 404 });
  }

  if (!product) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock available' }, status: 400 });
  }

  const { data: existingCart, error: cartError } = await supabase.from('carts').select('*').eq('user_id', userId).single();
  
  if (cartError && cartError.code !== 'PGRST116') {
    console.error('[Cart API] Cart fetch error:', cartError);
  }

  let cartItems = existingCart?.items || [];
  const existingItemIndex = cartItems.findIndex((item: any) => item.productId === productId);

  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({ productId, product, quantity, price: product.price });
  }

  const cartData = {
    user_id: userId,
    items: cartItems,
    updated_at: new Date().toISOString()
  };
  
  console.log('[Cart API] Upserting cart data:', JSON.stringify(cartData, null, 2));
  
  const { error: upsertError } = await supabase
    .from('carts')
    .upsert(cartData, { onConflict: 'user_id' });
  
  if (upsertError) {
    console.error('[Cart API] Cart upsert error:', upsertError);
    throw upsertError;
  }

  const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  console.log('[Cart API] Cart updated successfully');
  return res.status(200).json({ items: cartItems, total, itemCount });
}

async function syncCart(req: VercelRequest, res: VercelResponse, userId: string) {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Items must be an array' }, status: 400 });
  }

  const validatedItems = [];
  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) continue;

    const { data: product } = await supabase.from('products').select('*').eq('id', item.productId).eq('is_active', true).single();
    if (!product) continue;

    validatedItems.push({
      productId: product.id,
      product,
      quantity: Math.min(item.quantity, product.stock),
      price: product.price,
    });
  }

  const { data: existingCart } = await supabase.from('carts').select('*').eq('user_id', userId).single();
  let serverItems = existingCart?.items || [];
  const mergedItems = [...serverItems];

  for (const localItem of validatedItems) {
    const existingIndex = mergedItems.findIndex((item: any) => item.productId === localItem.productId);
    if (existingIndex === -1) mergedItems.push(localItem);
  }

  const cartData = {
    user_id: userId,
    items: mergedItems,
    updated_at: new Date().toISOString()
  };
  
  console.log('[Cart API] Syncing cart data:', JSON.stringify(cartData, null, 2));
  
  const { error: syncError } = await supabase
    .from('carts')
    .upsert(cartData, { onConflict: 'user_id' });
  
  if (syncError) {
    console.error('[Cart API] Cart sync error:', syncError);
    throw syncError;
  }

  const total = mergedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const itemCount = mergedItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return res.status(200).json({ items: mergedItems, total, itemCount });
}
