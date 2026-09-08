import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getUserFromAuth(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error || !user ? null : user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const user = await getUserFromAuth(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' }, status: 401 });
    }

    const { action } = req.query;

    if (req.method === 'GET') {
      return await getCart(res, user.id);
    }

    if (req.method === 'DELETE' || action === 'clear') {
      return await clearCart(res, user.id);
    }

    if (req.method === 'POST') {
      if (action === 'sync') return await syncCart(req, res, user.id);
      return await addToCart(req, res, user.id);
    }

    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  } catch (error: any) {
    console.error('Cart API error:', error);
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

async function getCart(res: VercelResponse, userId: string) {
  const { data: cart } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();
  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemCount = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);

  return res.status(200).json({ items, total, itemCount });
}

async function clearCart(res: VercelResponse, userId: string) {
  await supabase.from('carts').upsert({
    user_id: userId,
    items: [],
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  return res.status(200).json({ items: [], total: 0, itemCount: 0 });
}

async function addToCart(req: VercelRequest, res: VercelResponse, userId: string) {
  const { productId, quantity, size } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid product ID and quantity required' }, status: 400 });
  }

  const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', productId).eq('is_active', true).maybeSingle();

  if (productError || !product) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' }, status: 404 });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: { code: 'INSUFFICIENT_STOCK', message: 'Insufficient stock available' }, status: 400 });
  }

  const { data: existingCart } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();

  let cartItems = existingCart?.items || [];
  const existingItemIndex = cartItems.findIndex((item: any) =>
    item.productId === productId && (item.size === size || (!item.size && !size))
  );

  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({
      productId,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        categories: product.categories || [],
        collection: product.collection,
        images: product.images || [],
        stock: product.stock,
        isActive: product.is_active,
        specifications: product.specifications || {},
        sizes: product.sizes || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      quantity,
      price: Number(product.price),
      size: size || undefined,
    });
  }

  const cartData = {
    user_id: userId,
    items: cartItems,
    updated_at: new Date().toISOString()
  };

  const { error: upsertError } = await supabase.from('carts').upsert(cartData, { onConflict: 'user_id' });

  if (upsertError) {
    throw upsertError;
  }

  const total = cartItems.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemCount = cartItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);

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

    const { data: product } = await supabase.from('products').select('*').eq('id', item.productId).eq('is_active', true).maybeSingle();
    if (!product) continue;

    validatedItems.push({
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        categories: product.categories || [],
        collection: product.collection,
        images: product.images || [],
        stock: product.stock,
        isActive: product.is_active,
        specifications: product.specifications || {},
        sizes: product.sizes || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      quantity: Math.min(item.quantity, product.stock),
      price: Number(product.price),
      size: item.size || undefined,
    });
  }

  const { data: existingCart } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();
  let serverItems = existingCart?.items || [];
  const mergedItems = [...serverItems];

  for (const localItem of validatedItems) {
    const existingIndex = mergedItems.findIndex((item: any) =>
      item.productId === localItem.productId && (item.size === localItem.size || (!item.size && !localItem.size))
    );
    if (existingIndex === -1) {
      mergedItems.push(localItem);
    }
  }

  const cartData = {
    user_id: userId,
    items: mergedItems,
    updated_at: new Date().toISOString()
  };

  const { error: syncError } = await supabase.from('carts').upsert(cartData, { onConflict: 'user_id' });

  if (syncError) {
    throw syncError;
  }

  const total = mergedItems.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemCount = mergedItems.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0);

  return res.status(200).json({ items: mergedItems, total, itemCount });
}
