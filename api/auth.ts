import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

  const { action } = req.query;

  try {
    if (action === 'login') return await login(req, res);
    if (action === 'register') return await register(req, res);
    if (action === 'reset-password') return await resetPassword(req, res);

    return res.status(400).json({ error: { code: 'INVALID_ACTION', message: 'Invalid action' }, status: 400 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function login(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: validationResult.error.issues }, status: 400 });
  }

  const { email, password } = validationResult.data;
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user || !authData.session) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();

  return res.status(200).json({
    user: { id: authData.user.id, email: authData.user.email!, fullName: profile?.full_name, role: profile?.role, createdAt: profile?.created_at },
    session: { accessToken: authData.session.access_token, refreshToken: authData.session.refresh_token, expiresAt: authData.session.expires_at || 0 }
  });
}

async function register(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: validationResult.error.issues }, status: 400 });
  }

  const { email, password, fullName } = validationResult.data;
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

  if (authError) {
    if (authError.message.includes('already registered')) {
      return res.status(409).json({ error: { code: 'ALREADY_EXISTS', message: 'User with this email already exists' }, status: 409 });
    }
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: authError.message }, status: 400 });
  }

  if (!authData.user) {
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to create user' }, status: 500 });
  }

  await supabase.from('profiles').insert({ id: authData.user.id, full_name: fullName, role: 'customer' });
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();

  return res.status(201).json({
    user: { id: authData.user.id, email: authData.user.email!, fullName: profile?.full_name || fullName, role: profile?.role || 'customer', createdAt: authData.user.created_at },
    session: authData.session ? { accessToken: authData.session.access_token, refreshToken: authData.session.refresh_token, expiresAt: authData.session.expires_at || 0 } : null
  });
}

async function resetPassword(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const validationResult = resetPasswordSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: validationResult.error.issues }, status: 400 });
  }

  const { email } = validationResult.data;
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/reset-password` });

  return res.status(200).json({ message: 'If an account exists with this email, a password reset link has been sent.' });
}
