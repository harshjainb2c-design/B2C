import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-10-29.clover' });
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = { api: { bodyParser: false } };

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }, status: 405 });
  }

  const { action } = req.query;

  try {
    if (action === 'webhook') return await handleWebhook(req, res);
    return await createPaymentIntent(req, res);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, status: 500 });
  }
}

async function createPaymentIntent(req: VercelRequest, res: VercelResponse) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { amount, currency = 'usd' } = body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid amount' }, status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
}

async function handleWebhook(req: VercelRequest, res: VercelResponse) {
  const rawBody = await getRawBody(req);
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing stripe-signature header' }, status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (err) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid signature' }, status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await supabase.from('orders').update({ status: 'processing' }).eq('payment_intent_id', paymentIntent.id);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await supabase.from('orders').update({ status: 'cancelled' }).eq('payment_intent_id', paymentIntent.id);
  }

  return res.status(200).json({ received: true });
}
