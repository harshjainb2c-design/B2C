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
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuthStore } from "../../stores/authStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { CartDrawer } from "../cart/CartDrawer";
import { useToast } from "../../hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { itemCount } = useCart();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, isAdmin, logout } = useAuthStore();
  const { toast } = useToast();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const announcements = [
    "FREE SHIPPING ON ORDERS ABOVE ₹999",
    "EXTRA 10% OFF • CODE: B2CFIRST",
    "EASY 7-DAY RETURNS & EXCHANGES",
    "CASH ON DELIVERY AVAILABLE",
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
  const isHomePage = currentPath === "/";

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
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen]);

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

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Voice Search Unavailable",
        description: "Your browser does not support voice search.",
      });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join("");
        setSearchTerm(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access in your browser settings.",
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsProfileOpen((prev) => !prev);
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
      {isHomePage && (
        <div className="b2c-top-announcement-strip bg-[#141414] text-neutral-300 text-[8.5px] sm:text-[11px] font-medium tracking-[0.08em] sm:tracking-[0.14em] uppercase py-1 sm:py-1.5 px-3 border-b border-neutral-900 select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
            <span
              key={announcementIndex}
              className="inline-block animate-in fade-in duration-300 truncate"
            >
              {announcements[announcementIndex]}
            </span>
          </div>
        </div>
      )}

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
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isListening ? "Listening... Speak now" : "What are you looking for?"}
                  className="b2c-search-input w-full bg-black text-white text-xs xl:text-sm pl-4 pr-20 py-2.5 rounded-full border border-neutral-800 focus:border-neutral-500 outline-none ring-0 placeholder:text-neutral-500"
                  style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                />
                <div className="b2c-search-icons absolute right-2.5 flex items-center gap-1 text-neutral-400">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="p-1 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1 transition-colors ${
                      isListening ? "text-red-500 animate-pulse" : "hover:text-white"
                    }`}
                    aria-label={isListening ? "Listening... click to stop" : "Voice search"}
                    title={isListening ? "Listening... click to stop" : "Voice search"}
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
                  onClick={handleProfileClick}
                  className="p-2 text-white hover:bg-neutral-900 rounded-full transition-colors flex items-center"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5" />
                </button>

                {user && isProfileOpen && (
                  <div className="b2c-profile-dropdown absolute right-0 mt-3 w-56 bg-black text-white rounded-2xl shadow-2xl border border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  </div>
                )}
              </div>

              <Link
                to="/mywishlist"
                className="b2c-wishlist-action p-2 text-white rounded-full relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
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

          {isMobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 border-t border-neutral-900 bg-black animate-in fade-in duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isListening ? "Listening... Speak now" : "What are you looking for?"}
                  autoFocus
                  className="w-full bg-black text-white text-sm pl-4 pr-20 py-2 rounded-full border border-neutral-800 focus:border-neutral-500 outline-none ring-0 placeholder:text-neutral-500"
                  style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-neutral-400">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="p-1 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1 transition-colors ${
                      isListening ? "text-red-500 animate-pulse" : "hover:text-white"
                    }`}
                    aria-label={isListening ? "Listening... click to stop" : "Voice search"}
                    title={isListening ? "Listening... click to stop" : "Voice search"}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="submit"
                    className="p-1 hover:text-white transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
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
        className={`b2c-drawer-panel fixed top-0 left-0 h-screen h-[100dvh] max-h-[100dvh] w-[300px] sm:w-[360px] bg-black text-white border-r border-neutral-900 z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden select-none ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="b2c-drawer-top flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-neutral-900 bg-black z-10">
          <span className="font-extrabold text-sm tracking-widest text-white uppercase">
            MENU
          </span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="b2c-drawer-content flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-6 bg-black">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
              Shop by Apparel
            </p>
            <Link
              to="/products?category=upper-wear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Upper Wear</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?category=bottom-wear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Bottom Wear</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?category=footwear"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
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
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Winter Collection</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
            <Link
              to="/products?collection=summer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Summer Collection</span>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </Link>
          </div>

          {user && (
            <div className="space-y-1 pt-2 border-t border-neutral-900">
              <p className="px-3 text-[11px] font-black tracking-widest text-neutral-500 uppercase">
                Account & Orders
              </p>
              <Link
                to="/profile"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  Profile
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>
              <Link
                to="/orders"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors"
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
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 transition-colors"
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
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 text-neutral-500" />
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-neutral-900 bg-black text-xs text-neutral-400 flex items-center justify-between z-10">
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
