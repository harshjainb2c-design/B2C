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

/**
 * Authentication hook that provides login, register, and logout functionality
 * Uses TanStack Query for mutations and Zustand for state management
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, session, isLoading, setUser, setSession, setLoading, logout: storeLogout, isAdmin } = useAuthStore();

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      setLoading(true);

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        throw new Error(authError.message || 'Invalid email or password');
      }

      if (!authData.user || !authData.session) {
        throw new Error('Invalid email or password');
      }

      // Fetch user profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        // Extract full name from user metadata or use email
        const fullName = authData.user.user_metadata?.full_name || 
                        authData.user.email?.split('@')[0] || 
                        'User';

        // Create profile - RLS policy allows users to insert their own profile
        const { data: insertedProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            role: 'customer',
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create user profile: ${createError.message}`);
        }

        profile = insertedProfile;
      } else if (profileError) {
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Map to our types
      const mappedUser: User = {
        id: authData.user.id,
        email: authData.user.email!,
        fullName: profile.full_name,
        role: profile.role,
        createdAt: profile.created_at,
      };

      const mappedSession: Session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at || 0,
      };

      return { user: mappedUser, session: mappedSession };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
      setLoading(false);
      // Invalidate any cached queries that depend on auth state
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      setLoading(false);
    },
  });

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      setLoading(true);

      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
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

      // The database trigger creates the profile independently of client authentication.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Account was created, but its profile could not be loaded. Please try signing in again.');
      }

      // Map to our types
      const mappedUser: User = {
        id: authData.user.id,
        email: authData.user.email!,
        fullName: profile?.full_name || data.fullName,
        role: profile?.role || 'customer',
        createdAt: authData.user.created_at,
      };

      const mappedSession: Session = {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at || 0,
      };

      return { user: mappedUser, session: mappedSession };
    },
    onSuccess: (data) => {
      setUser(data.user);
      setSession(data.session);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      setLoading(false);
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await storeLogout();
    },
    onSuccess: () => {
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });

  /**
   * Reset password mutation
   */
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Password reset email sent' };
    },
  });

  return {
    // State
    user,
    session,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),

    // Actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,

    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
};
