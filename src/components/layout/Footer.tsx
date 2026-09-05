import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <>
      <footer className="bg-black text-white border-t border-neutral-900 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-neutral-900">
            <div className="lg:col-span-4 flex flex-col items-start">
              <Link
                to="/"
                className="font-dirtyline text-3xl sm:text-4xl tracking-wider text-white uppercase mb-4 hover:opacity-90 transition-opacity"
              >
                B2C EXPORTS
              </Link>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-sm mb-6">
                B2C is built for those who stand out. Premium streetwear crafted with quality fabrics, bold designs, and everyday comfort for the modern rebel.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-700 hover:border-white text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/b2cexports_since_2018/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-neutral-700 hover:border-white text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white mb-4">
                PAGES
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/privacy"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white mb-4">
                QUICK LINKS
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>New Drop</span>
                    <span>🔥</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Collections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors block"
                  >
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white mb-4">
                NEWSLETTER
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5">
                Subscribe to get early access to new drops, exclusive offers, and the latest B2C streetwear collections delivered straight to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative w-full max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email..."
                  required
                  className="w-full bg-[#18181b] border border-neutral-800 text-white placeholder:text-neutral-500 text-xs sm:text-sm px-4 py-3 pr-11 rounded-none focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                  aria-label="Subscribe"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">
                  Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              © 2026 B2C Exports. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919098178762"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-white"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
      </a>
    </>
  );
};
