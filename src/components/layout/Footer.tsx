import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#3d3228] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-bold text-[#c9a87c] mb-4 tracking-wider">
              COMPANY
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-bold text-[#c9a87c] mb-4 tracking-wider">
              HELP
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/returns"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-white/80 hover:text-[#c9a87c] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-[#c9a87c] mb-4 tracking-wider">
              SUPPORT
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Mail className="w-4 h-4 text-[#c9a87c]" />
                <a href="mailto:harshjain2904@gmail.com" className="hover:text-[#c9a87c] transition-colors">
                  harshjain2904@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="w-4 h-4 text-[#c9a87c]" />
                <a href="tel:+919098178762" className="hover:text-[#c9a87c] transition-colors">
                  +91 9098178762
                </a>
              </li>
              <li className="text-xs text-white/60 mt-2">
                Mon - Sat: 10:00 AM - 08:00 PM
              </li>
              <li className="text-xs text-white/60">
                Sun: 11:00 AM - 06:00 PM
              </li>
              <li className="text-xs text-white/60">
                137 Malwa Mill, Indore - 452005
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-[#c9a87c] mb-4 tracking-wider">
              GET UPDATES
            </h3>
            <p className="text-xs text-white/70 mb-3">
              Subscribe to get special offers and updates
            </p>
            <div className="flex gap-0 max-w-sm">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-l text-white placeholder:text-white/50 focus:outline-none focus:border-[#c9a87c] focus:z-10"
              />
              <button className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-[#c9a87c] to-[#b8956b] text-white text-sm font-semibold rounded-r hover:from-[#b8956b] hover:to-[#c9a87c] transition-all">
                →
              </button>
            </div>
            <p className="text-xs text-white/50 mt-2">
              * Don't worry we don't spam
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/60">
              © 2018-2025 B2C Exports & B2C Kicks, Indore. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-xs text-white/60 hover:text-[#c9a87c] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-xs text-white/60 hover:text-[#c9a87c] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/sitemap"
                className="text-xs text-white/60 hover:text-[#c9a87c] transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
