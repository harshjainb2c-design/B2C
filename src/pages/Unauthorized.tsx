import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full text-center border border-neutral-800 p-8 sm:p-12 bg-black">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-red-800 bg-red-950/30 flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Access Restricted
        </h1>
        
        <p className="text-xs font-mono text-neutral-400 mb-8">
          This area is restricted to authorized studio personnel and administrators only.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full py-3 px-6 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            Go to Home
          </Link>
          
          <Link
            to="/products"
            className="block w-full py-3 px-6 border border-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider hover:border-white transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
};
