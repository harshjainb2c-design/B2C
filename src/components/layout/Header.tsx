import { useState, useRef, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingCart,
  Mic,
  ChevronRight,
  LogOut,
  Package,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuthStore } from "../../stores/authStore";
import { CartDrawer } from "../cart/CartDrawer";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuthStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const announcements = [
    "LIMITED RELEASES. EXCLUSIVE DROPS. ELEGANCE IS NOW LIVE.",
    "FREE EXPRESS DELIVERY ON ORDERS OVER ₹2,000",
    "SPECIAL INTRODUCTORY OFFER • 10% OFF CODE: B2CFIRST",
  ];
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const currentGender = searchParams.get("gender")?.toLowerCase();
  const currentCategory = searchParams.get("category")?.toLowerCase();
  const currentPath = location.pathname.toLowerCase();

  const isMenActive =
    currentPath === "/men" ||
    (currentPath === "/products" && currentGender === "men");
  const isWomenActive =
    currentPath === "/women" ||
    (currentPath === "/products" && currentGender === "women");
  const isSneakersActive =
    currentPath === "/sneakers" ||
    (currentPath === "/products" &&
      (currentCategory === "footwear" || currentCategory === "sneakers"));

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsProfileOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
    }
  };

  return (
    <>
      <div className="b2c-top-announcement-strip bg-[#262626] text-white text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase py-2 px-4 border-b border-neutral-800 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <span className="inline-block transition-all duration-300 truncate">
            {announcements[announcementIndex]}
          </span>
        </div>
      </div>

      <header className="b2c-header-wrapper sticky top-0 z-40 bg-black text-white border-b border-neutral-900">
        <div className="b2c-nav-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-black">
          <div className="b2c-nav-grid flex items-center justify-between h-16 md:h-20 gap-2 md:gap-6 bg-black">
            <div className="b2c-left-section flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="b2c-drawer-btn p-2 -ml-2 rounded-lg text-white hover:bg-neutral-900 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>

              <nav className="b2c-gender-tabs hidden md:flex items-center space-x-1 lg:space-x-3">
                <Link
                  to="/products?gender=men"
                  className={`b2c-tab-link px-3 py-1 text-xs lg:text-sm font-bold tracking-wider uppercase transition-all ${
                    isMenActive ? "text-white" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span className="relative pb-1 inline-block">
                    MEN
                    {isMenActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                    )}
                  </span>
                </Link>
                <Link
                  to="/products?gender=women"
                  className={`b2c-tab-link px-3 py-1 text-xs lg:text-sm font-bold tracking-wider uppercase transition-all ${
                    isWomenActive ? "text-white" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span className="relative pb-1 inline-block">
                    WOMEN
                    {isWomenActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                    )}
                  </span>
                </Link>
                <Link
                  to="/products?category=footwear"
                  className={`b2c-tab-link px-3 py-1 text-xs lg:text-sm font-bold tracking-wider uppercase transition-all ${
                    isSneakersActive ? "text-white" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span className="relative pb-1 inline-block">
                    SNEAKERS
                    {isSneakersActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                    )}
                  </span>
                </Link>
              </nav>
            </div>

            <div className="b2c-center-section flex items-center justify-center flex-shrink-0">
            </div>

            <div className="b2c-right-section flex items-center justify-end gap-1 sm:gap-3 flex-1 min-w-0">
              <form
                onSubmit={handleSearchSubmit}
                className="b2c-search-wrapper hidden lg:flex items-center relative w-full max-w-[260px] xl:max-w-[320px]"
              >
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What are you looking for?"
                  className="b2c-search-input w-full bg-black text-white text-xs xl:text-sm pl-4 pr-16 py-2.5 rounded-full border border-neutral-800 focus:border-neutral-600 focus:outline-none transition-all placeholder:text-neutral-500"
                />
                <div className="b2c-search-icons absolute right-2.5 flex items-center gap-1.5 text-neutral-400">
                  <button
                    type="button"
                    className="p-1 hover:text-white transition-colors"
                    aria-label="Voice search"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="submit"
                    className="p-1 hover:text-white transition-colors"
                    aria-label="Submit search"
                  >
                    <Search className="w-4 h-4 text-neutral-400 hover:text-white" />
                  </button>
                </div>
              </form>

              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="b2c-mobile-search-btn lg:hidden p-2 text-white hover:bg-neutral-900 rounded-full transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="b2c-profile-action relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-white hover:bg-neutral-900 rounded-full transition-colors flex items-center"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5" />
                </button>

                {isProfileOpen && (
                  <div className="b2c-profile-dropdown absolute right-0 mt-3 w-56 bg-black text-white rounded-2xl shadow-2xl border border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {user ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-neutral-900">
                          <p className="text-xs text-neutral-400 uppercase font-semibold tracking-wider">
                            Signed in as
                          </p>
                          <p className="text-sm font-bold text-white truncate">
                            {user.fullName || user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                          >
                            <User className="w-4 h-4 mr-3 text-neutral-400" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                          >
                            <Package className="w-4 h-4 mr-3 text-neutral-400" />
                            My Orders
                          </Link>
                          {isAdmin() && (
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-900 transition-colors font-medium"
                            >
                              <ShieldAlert className="w-4 h-4 mr-3 text-red-400" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-neutral-900 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3 text-neutral-400" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-1">
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-900 hover:text-white font-semibold transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-900 hover:text-red-300 font-semibold transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/mywishlist"
                className="b2c-wishlist-action p-2 text-white hover:text-red-400 hover:bg-neutral-900 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="b2c-cart-action p-2 text-white hover:bg-neutral-900 rounded-full transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="b2c-cart-badge absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center space-x-6 py-2.5 border-t border-neutral-900 bg-black">
            <Link
              to="/products?gender=men"
              className={`text-xs font-bold tracking-wider uppercase ${
                isMenActive ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <span className="relative pb-1 inline-block">
                MEN
                {isMenActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </span>
            </Link>
            <Link
              to="/products?gender=women"
              className={`text-xs font-bold tracking-wider uppercase ${
                isWomenActive ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <span className="relative pb-1 inline-block">
                WOMEN
                {isWomenActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </span>
            </Link>
            <Link
              to="/products?category=footwear"
              className={`text-xs font-bold tracking-wider uppercase ${
                isSneakersActive ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <span className="relative pb-1 inline-block">
                SNEAKERS
                {isSneakersActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </span>
            </Link>
          </div>

          {isMobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 border-t border-neutral-900 bg-black animate-in fade-in duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What are you looking for?"
                  autoFocus
                  className="w-full bg-black text-white text-sm pl-4 pr-12 py-2 rounded-full border border-neutral-800 focus:outline-none focus:border-neutral-600 placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {isDrawerOpen && (
        <div
          className="b2c-drawer-backdrop fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <aside
        className={`b2c-drawer-panel fixed top-0 left-0 bottom-0 w-[300px] sm:w-[360px] bg-black text-white border-r border-neutral-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="b2c-drawer-top flex items-center justify-between px-5 py-4 border-b border-neutral-900 bg-black">
          <span className="font-extrabold text-sm tracking-widest text-white uppercase">
            MENU
          </span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="b2c-drawer-content flex-1 overflow-y-auto px-4 py-4 space-y-6 bg-black">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
              Main Categories
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Link
                to="/products?gender=men"
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  isMenActive
                    ? "bg-neutral-900 text-white border border-neutral-700 shadow-sm"
                    : "bg-black text-neutral-300 hover:bg-neutral-900 hover:text-white border border-neutral-800"
                }`}
              >
                <Flame className="w-4 h-4 mb-1 text-red-500" />
                MEN
              </Link>
              <Link
                to="/products?gender=women"
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  isWomenActive
                    ? "bg-neutral-900 text-white border border-neutral-700 shadow-sm"
                    : "bg-black text-neutral-300 hover:bg-neutral-900 hover:text-white border border-neutral-800"
                }`}
              >
                <Sparkles className="w-4 h-4 mb-1 text-purple-400" />
                WOMEN
              </Link>
              <Link
                to="/products?category=footwear"
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  isSneakersActive
                    ? "bg-neutral-900 text-white border border-neutral-700 shadow-sm"
                    : "bg-black text-neutral-300 hover:bg-neutral-900 hover:text-white border border-neutral-800"
                }`}
              >
                <Layers className="w-4 h-4 mb-1 text-amber-400" />
                SNEAKERS
              </Link>
            </div>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
              Shop by Apparel
            </p>
            <Link
              to="/products?category=upper-wear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span>Upper Wear</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?category=bottom-wear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span>Bottom Wear</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?category=footwear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span>Footwear & Sneakers</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
              Collections
            </p>
            <Link
              to="/products?collection=winter"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span>Winter Collection</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?collection=summer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              <span>Summer Collection</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-900">
            <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
              Account & Orders
            </p>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-neutral-400" />
                    My Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-neutral-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      Admin Dashboard
                    </span>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-neutral-500" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 px-1">
                <Link
                  to="/login"
                  className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl border border-neutral-700 text-white hover:bg-neutral-900 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-900 bg-black text-xs text-neutral-400 flex items-center justify-between">
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
          <Link to="/shipping" className="hover:text-white transition-colors">
            Shipping
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </div>
      </aside>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
