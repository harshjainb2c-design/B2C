import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-medium text-gray-900 mb-3">
          Access Denied
        </h1>
        
        <p className="text-sm text-gray-600 mb-8">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-block w-full px-6 py-2.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </Link>
          
          <Link
            to="/products"
            className="inline-block w-full px-6 py-2.5 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            Browse Products
          </Link>
        </div>
        
        <p className="mt-8 text-xs text-gray-500">
          If you believe you should have access, please contact your administrator.
        </p>
      </div>
    </div>
  );
};
