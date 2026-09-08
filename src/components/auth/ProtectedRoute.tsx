import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInitialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center select-none">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
          <p className="mt-3 text-xs tracking-wider text-neutral-400 uppercase font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
