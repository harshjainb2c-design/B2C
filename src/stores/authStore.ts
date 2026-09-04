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
          set({ user: null, session: null, isLoading: false });
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
        
        // Prevent multiple simultaneous initializations
        if (state.isInitialized || state.isLoading) {
          return;
        }
        
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error || !sessionData.session) {
          set({ user: null, session: null, isInitialized: true });
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();

        if (!profile) {
          set({ user: null, session: null, isInitialized: true });
          return;
        }

        set({
          user: {
            id: profile.id,
            email: sessionData.session.user.email || '',
            fullName: profile.full_name,
            role: profile.role,
            createdAt: profile.created_at,
          },
          session: {
            accessToken: sessionData.session.access_token,
            refreshToken: sessionData.session.refresh_token || '',
            expiresAt: sessionData.session.expires_at || 0,
          },
          isInitialized: true,
        });
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

// Set up auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();

  if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setSession(null);
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    if (session) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const mappedSession: Session = {
          accessToken: session.access_token,
          refreshToken: session.refresh_token || '',
          expiresAt: session.expires_at || 0,
        };

        const mappedUser: User = {
          id: profile.id,
          email: session.user.email || '',
          fullName: profile.full_name,
          role: profile.role,
          createdAt: profile.created_at,
        };

        store.setUser(mappedUser);
        store.setSession(mappedSession);
      }
    }
  }
});
