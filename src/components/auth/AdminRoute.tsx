import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * AdminRoute wrapper component that protects admin-only routes
 * Redirects to login if not authenticated
 * Redirects to unauthorized page if authenticated but not admin
 */
export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAdmin, isInitialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if not admin
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and is admin
  return <>{children}</>;
};
