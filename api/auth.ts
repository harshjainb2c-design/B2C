import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } });
  }

  const { action } = req.query;

  try {
    if (action === 'login') return await login(req, res);
    if (action === 'register') return await register(req, res);
    if (action === 'reset-password') return await resetPassword(req, res);

    return res.status(400).json({ error: { code: 'INVALID_ACTION', message: 'Invalid action' } });
  } catch (error: any) {
    console.error('Auth handler error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error?.message || 'Internal server error' } });
  }
}

async function login(req: VercelRequest, res: VercelResponse) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user || !authData.session) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceKey);
  let profile: any = null;
  try {
    const { data } = await adminClient.from('profiles').select('*').eq('id', authData.user.id).maybeSingle();
    profile = data;
    if (!profile) {
      const fallbackName = authData.user.user_metadata?.full_name || email.split('@')[0] || 'User';
      const { data: createdProfile } = await adminClient.from('profiles').upsert({
        id: authData.user.id,
        full_name: fallbackName,
        role: 'customer',
        email,
      }, { onConflict: 'id' }).select().maybeSingle();
      profile = createdProfile;
    }
  } catch {}

  return res.status(200).json({
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      fullName: profile?.full_name || authData.user.user_metadata?.full_name || email.split('@')[0] || 'User',
      role: profile?.role || authData.user.user_metadata?.role || 'customer',
      createdAt: profile?.created_at || authData.user.created_at,
    },
    session: {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt: authData.session.expires_at || 0,
    }
  });
}

async function register(req: VercelRequest, res: VercelResponse) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const rawName = String(req.body?.fullName || '').trim();
  const fullName = rawName || email.split('@')[0] || 'User';

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid email is required' } });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters' } });
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceKey);
  const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'customer' },
  });

  if (adminError) {
    const msg = adminError.message.toLowerCase();
    if (msg.includes('already') || msg.includes('exists')) {
      return res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'User with this email already exists' } });
    }
    return res.status(400).json({ error: { code: 'REGISTRATION_FAILED', message: adminError.message } });
  }

  const userId = adminData.user.id;

  try {
    await adminClient.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      role: 'customer',
      email,
    }, { onConflict: 'id' });
  } catch {}

  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: signInData } = await anonClient.auth.signInWithPassword({ email, password });

  return res.status(201).json({
    user: {
      id: userId,
      email: adminData.user.email!,
      fullName,
      role: 'customer',
      createdAt: adminData.user.created_at,
    },
    session: signInData?.session ? {
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      expiresAt: signInData.session.expires_at || 0,
    } : null,
  });
}

async function resetPassword(req: VercelRequest, res: VercelResponse) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid email is required' } });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/reset-password`,
  });

  return res.status(200).json({ message: 'If an account exists with this email, a password reset link has been sent.' });
}
