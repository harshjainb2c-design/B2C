import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAdmin, isInitialized, initialize } = useAuthStore();
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
          <p className="mt-3 text-xs tracking-wider text-neutral-400 uppercase font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
