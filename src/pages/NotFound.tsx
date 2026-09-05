import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 select-none">
      <div className="max-w-md w-full text-center border border-neutral-800 p-8 sm:p-12 bg-black">
        <div className="mb-6">
          <span className="text-8xl sm:text-9xl font-mono font-bold tracking-tighter text-white block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-2">
            Archive Not Found
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            The piece or page you are requesting has moved, sold out, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider hover:border-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
