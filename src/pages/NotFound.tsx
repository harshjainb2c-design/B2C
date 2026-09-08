import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 select-none font-inter">
      <div className="max-w-md w-full text-center border border-white/10 rounded-2xl p-8 sm:p-12 bg-neutral-950/50 font-inter">
        <div className="mb-6">
          <span className="text-7xl sm:text-8xl font-inter font-extrabold tracking-tight text-white block">
            404
          </span>
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white mt-2">
            Archive Not Found
          </h1>
          <p className="text-xs font-inter text-neutral-400 mt-2">
            The piece or page you are requesting has moved, sold out, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white text-black text-xs font-inter font-bold uppercase tracking-wider rounded-full border border-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-white/15 text-white text-xs font-inter font-bold uppercase tracking-wider rounded-full bg-neutral-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
