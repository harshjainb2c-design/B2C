import { Link } from 'react-router-dom';

export const Sitemap = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-8">Sitemap</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Pages */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Main Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-gray-900">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-sm text-gray-600 hover:text-gray-900">
                  Our Store
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account Pages */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Policies */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Policies</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-sm text-gray-600 hover:text-gray-900">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-600 hover:text-gray-900">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-sm text-gray-600 hover:text-gray-900">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
