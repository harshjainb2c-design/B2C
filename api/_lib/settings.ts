import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  enabled: boolean;
}

export interface ShiprocketConfig {
  email: string;
  password: string;
  pickupLocation: string;
  webhookSecret: string;
  enabled: boolean;
}

export const getRazorpayConfig = async (): Promise<RazorpayConfig> => {
  const envConfig: RazorpayConfig = {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  };

  try {
    const { data } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      const keyId = data.razorpay_key_id || data.value?.keyId || envConfig.keyId;
      const keySecret = data.razorpay_key_secret || data.value?.keySecret || envConfig.keySecret;
      return {
        keyId,
        keySecret,
        enabled: Boolean(keyId && keySecret),
      };
    }
  } catch {}

  return envConfig;
};

export const getShiprocketConfig = async (): Promise<ShiprocketConfig> => {
  const envConfig: ShiprocketConfig = {
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'work',
    webhookSecret: process.env.SHIPROCKET_WEBHOOK_SECRET || '',
    enabled: Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD),
  };

  try {
    const { data } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      const email = data.shiprocket_email || data.value?.email || envConfig.email;
      const password = data.shiprocket_password || data.value?.password || envConfig.password;
      const pickupLocation = data.shiprocket_pickup_location || data.value?.pickupLocation || envConfig.pickupLocation;
      const webhookSecret = data.shiprocket_webhook_secret || data.value?.webhookSecret || envConfig.webhookSecret;
      return {
        email,
        password,
        pickupLocation,
        webhookSecret,
        enabled: Boolean(email && password),
      };
    }
  } catch {}

  return envConfig;
};

export const maskSecret = (secret: string): string => {
  if (!secret) return '';
  if (secret.length <= 6) return '******';
  return secret.slice(0, 3) + '******' + secret.slice(-3);
};
