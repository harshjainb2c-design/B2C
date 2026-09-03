import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * SessionExpirationHandler component
 * Monitors auth state and handles session expiration
 */
export function SessionExpirationHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      // Handle session expiration
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // Don't show toast if user is already on login page
        if (location.pathname !== '/login') {
          toast({
            variant: 'destructive',
            title: 'Session Expired',
            description: 'Your session has expired. Please log in again.',
          });

          // Redirect to login with return URL
          navigate('/login', {
            state: { from: location.pathname },
            replace: true,
          });
        }
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.error('Token refresh failed');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location, toast]);

  return null;
}
