import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  Session,
  AuthResponse,
} from '../types/user';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, session, isLoading, setUser, setSession, logout: storeLogout, isAdmin } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const cleanEmail = credentials.email.trim().toLowerCase();
      const password = credentials.password;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch('/api/auth?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error?.message || 'Invalid email or password');
        }

        if (data?.session) {
          try {
            await supabase.auth.setSession({
              access_token: data.session.accessToken,
              refresh_token: data.session.refreshToken,
            });
          } catch {}
        }

        return data;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('Connection timed out. Please check your internet or Supabase service.');
        }
        if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          throw err;
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (authError || !authData?.user || !authData?.session) {
          throw new Error(authError?.message || 'Invalid email or password');
        }

        const mappedUser: User = {
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          fullName: authData.user.user_metadata?.full_name || cleanEmail.split('@')[0] || 'User',
          role: (authData.user.user_metadata?.role as 'customer' | 'admin') || 'customer',
          createdAt: authData.user.created_at || new Date().toISOString(),
        };

        const mappedSession: Session = {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token || '',
          expiresAt: authData.session.expires_at || 0,
        };

        return { user: mappedUser, session: mappedSession };
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      if (data.session) setSession(data.session);
      useAuthStore.setState({ isInitialized: true, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const cleanEmail = data.email.trim().toLowerCase();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch('/api/auth?action=register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, email: cleanEmail }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData?.error?.message || 'Failed to create account');
        }

        if (resData?.session) {
          try {
            await supabase.auth.setSession({
              access_token: resData.session.accessToken,
              refresh_token: resData.session.refreshToken,
            });
          } catch {}
        }

        return resData;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error('Connection timed out. Please check your internet or Supabase service.');
        }
        if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
          throw err;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
            },
          },
        });

        if (authError) {
          if (authError.message.toLowerCase().includes('already')) {
            throw new Error('User with this email already exists');
          }
          throw new Error(authError.message || 'Failed to create account');
        }

        if (!authData?.user) {
          throw new Error('Failed to create account');
        }

        const mappedUser: User = {
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          fullName: data.fullName || 'User',
          role: 'customer',
          createdAt: authData.user.created_at || new Date().toISOString(),
        };

        const mappedSession: Session | null = authData.session ? {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token || '',
          expiresAt: authData.session.expires_at || 0,
        } : null;

        return { user: mappedUser, session: mappedSession as any };
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      if (data.session) setSession(data.session);
      useAuthStore.setState({ isInitialized: true, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await storeLogout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Password reset email sent' };
    },
  });

  return {
    user,
    session,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),

    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,

    loginError: loginMutation.error,
    registerError: registerMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
};
