import { Link } from 'react-router-dom';

export const Sitemap = () => {
  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 border-b border-neutral-800 pb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase mt-2">
            Archive Sitemap
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Index of all verified pages, collections, and legal documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-black border border-neutral-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4 pb-2 border-b border-neutral-900">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
                  01. Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">
                  02. All Streetwear
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-neutral-400 hover:text-white transition-colors">
                  03. Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  04. About B2C
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-neutral-400 hover:text-white transition-colors">
                  05. Flagship Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  06. Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-black border border-neutral-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4 pb-2 border-b border-neutral-900">
              Account
            </h2>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">
                  01. Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-neutral-400 hover:text-white transition-colors">
                  02. Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-400 hover:text-white transition-colors">
                  03. Member Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-neutral-400 hover:text-white transition-colors">
                  04. Order History
                </Link>
              </li>
              <li>
                <Link to="/reset-password" className="text-neutral-400 hover:text-white transition-colors">
                  05. Reset Password
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-black border border-neutral-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4 pb-2 border-b border-neutral-900">
              Policies
            </h2>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  01. Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">
                  02. Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-neutral-400 hover:text-white transition-colors">
                  03. Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-neutral-400 hover:text-white transition-colors">
                  04. Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-neutral-400 hover:text-white transition-colors">
                  05. Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
