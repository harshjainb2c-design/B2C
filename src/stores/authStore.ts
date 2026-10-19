import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  initialize: () => Promise<void>;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user });
      },

      setSession: (session) => {
        set({ session });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          set({ user: null, session: null, isLoading: false, isInitialized: true });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      initialize: async () => {
        const state = get();
        if (state.isInitialized) return;

        try {
          const { data: sessionData } = await supabase.auth.getSession();

          if (!sessionData?.session?.user) {
            const stored = state.session;
            if (stored?.refreshToken) {
              try {
                const { data: restored } = await supabase.auth.setSession({
                  access_token: stored.accessToken,
                  refresh_token: stored.refreshToken,
                });
                if (restored?.session?.user) {
                  set({ isInitialized: true, isLoading: false });
                  return;
                }
              } catch {}
            }
            set({ user: null, session: null, isInitialized: true, isLoading: false });
            return;
          }

          const supaUser = sessionData.session.user;
          let mappedUser: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            fullName: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'User',
            role: (supaUser.user_metadata?.role as 'customer' | 'admin') || 'customer',
            createdAt: supaUser.created_at || new Date().toISOString(),
          };

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supaUser.id)
              .maybeSingle();

            if (profile) {
              mappedUser = {
                id: profile.id,
                email: supaUser.email || mappedUser.email,
                fullName: profile.full_name || mappedUser.fullName,
                role: profile.role || mappedUser.role,
                createdAt: profile.created_at || mappedUser.createdAt,
              };
            }
          } catch {}

          set({
            user: mappedUser,
            session: {
              accessToken: sessionData.session.access_token,
              refreshToken: sessionData.session.refresh_token || '',
              expiresAt: sessionData.session.expires_at || 0,
            },
            isInitialized: true,
            isLoading: false,
          });
        } catch {
          set({ isInitialized: true, isLoading: false });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);

supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();

  if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setSession(null);
    useAuthStore.setState({ isInitialized: true, isLoading: false });
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
    if (session?.user) {
      let mappedUser: User = {
        id: session.user.id,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        role: (session.user.user_metadata?.role as 'customer' | 'admin') || 'customer',
        createdAt: session.user.created_at || new Date().toISOString(),
      };

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          mappedUser = {
            id: profile.id,
            email: session.user.email || mappedUser.email,
            fullName: profile.full_name || mappedUser.fullName,
            role: profile.role || mappedUser.role,
            createdAt: profile.created_at || mappedUser.createdAt,
          };
        }
      } catch {}

      store.setUser(mappedUser);
      store.setSession({
        accessToken: session.access_token,
        refreshToken: session.refresh_token || '',
        expiresAt: session.expires_at || 0,
      });
      useAuthStore.setState({ isInitialized: true, isLoading: false });
    } else {
      useAuthStore.setState({ isInitialized: true, isLoading: false });
    }
  }
});
