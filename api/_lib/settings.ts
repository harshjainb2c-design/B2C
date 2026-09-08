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
      .select('value')
      .eq('key', 'razorpay')
      .maybeSingle();

    if (data?.value) {
      return {
        keyId: data.value.keyId || envConfig.keyId,
        keySecret: data.value.keySecret || envConfig.keySecret,
        enabled: data.value.enabled !== undefined ? Boolean(data.value.enabled) : envConfig.enabled,
      };
    }
  } catch {}

  return envConfig;
};

export const getShiprocketConfig = async (): Promise<ShiprocketConfig> => {
  const envConfig: ShiprocketConfig = {
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    webhookSecret: process.env.SHIPROCKET_WEBHOOK_SECRET || '',
    enabled: Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD),
  };

  try {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'shiprocket')
      .maybeSingle();

    if (data?.value) {
      return {
        email: data.value.email || envConfig.email,
        password: data.value.password || envConfig.password,
        pickupLocation: data.value.pickupLocation || envConfig.pickupLocation,
        webhookSecret: data.value.webhookSecret || envConfig.webhookSecret,
        enabled: data.value.enabled !== undefined ? Boolean(data.value.enabled) : envConfig.enabled,
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
