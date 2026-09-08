import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl =
  (typeof __SUPABASE_URL__ !== 'undefined' && __SUPABASE_URL__) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://mujkpyeennxjkdvezpaz.supabase.co';

const supabaseAnonKey =
  (typeof __SUPABASE_ANON_KEY__ !== 'undefined' && __SUPABASE_ANON_KEY__) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amtweWVlbm54amtkdmV6cGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODUxMjIsImV4cCI6MjA3ODE2MTEyMn0.r67KrcqS-VU7-JFI-78m2iTxeLUJixQhp8Rm_ViNBDI';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-client-info': 'e-commerce-platform',
        },
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
};

export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};
