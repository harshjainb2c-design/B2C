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
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('/api/auth?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.user && data.session) {
            try {
              await supabase.auth.setSession({
                access_token: data.session.accessToken,
                refresh_token: data.session.refreshToken,
              });
            } catch {}
            return data;
          }
        }
      } catch {}

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid email or password');
      }

      if (!authData?.user || !authData?.session) {
        throw new Error('Invalid email or password');
      }

      let userRole: 'customer' | 'admin' = (authData.user.user_metadata?.role as 'customer' | 'admin') || 'customer';
      let userFullName = authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User';
      let userCreatedAt = authData.user.created_at || new Date().toISOString();

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profile) {
          userFullName = profile.full_name || userFullName;
          userRole = profile.role || userRole;
          userCreatedAt = profile.created_at || userCreatedAt;
        } else {
          try {
            await supabase.from('profiles').insert({
              id: authData.user.id,
              full_name: userFullName,
              role: userRole,
            });
          } catch {}
        }
      } catch {}

      const mappedUser: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        fullName: userFullName,
        role: userRole,
        createdAt: userCreatedAt,
      };

      const mappedSession: Session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token || '',
        expiresAt: authData.session.expires_at || 0,
      };

      return { user: mappedUser, session: mappedSession };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
      useAuthStore.setState({ isInitialized: true, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('/api/auth?action=register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const resData = await res.json();
          if (resData && resData.user) {
            if (resData.session) {
              try {
                await supabase.auth.setSession({
                  access_token: resData.session.accessToken,
                  refresh_token: resData.session.refreshToken,
                });
              } catch {}
            }
            return resData;
          }
        }
      } catch {}

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already exists')) {
          throw new Error('User with this email already exists');
        }
        throw new Error(authError.message || 'Failed to create account');
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      if (!authData.session) {
        throw new Error('Account created. Please confirm your email before signing in.');
      }

      let userRole: 'customer' | 'admin' = (authData.user.user_metadata?.role as 'customer' | 'admin') || 'customer';
      let userFullName = data.fullName || authData.user.user_metadata?.full_name || 'User';
      let userCreatedAt = authData.user.created_at || new Date().toISOString();

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profile) {
          userFullName = profile.full_name || userFullName;
          userRole = profile.role || userRole;
          userCreatedAt = profile.created_at || userCreatedAt;
        } else {
          try {
            await supabase.from('profiles').insert({
              id: authData.user.id,
              full_name: userFullName,
              role: userRole,
            });
          } catch {}
        }
      } catch {}

      const mappedUser: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        fullName: userFullName,
        role: userRole,
        createdAt: userCreatedAt,
      };

      const mappedSession: Session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token || '',
        expiresAt: authData.session.expires_at || 0,
      };

      return { user: mappedUser, session: mappedSession };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
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
