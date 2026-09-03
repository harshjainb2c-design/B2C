import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  Shirt,
  Wind,
  Sparkles,
  Grid3x3,
  Flower2,
  Sun,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuthStore } from "../../stores/authStore";
import { CartDrawer } from "../cart/CartDrawer";

export const Header = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAdmin, logout } = useAuthStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWinterDropdownOpen, setIsWinterDropdownOpen] = useState(false);
  const [isSummerDropdownOpen, setIsSummerDropdownOpen] = useState(false);
  const [isMobileWinterOpen, setIsMobileWinterOpen] = useState(false);
  const [isMobileSummerOpen, setIsMobileSummerOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const winterDropdownRef = useRef<HTMLDivElement>(null);
  const summerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        winterDropdownRef.current &&
        !winterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWinterDropdownOpen(false);
      }
      if (
        summerDropdownRef.current &&
        !summerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSummerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      // Handle logout error silently
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-500 bg-[#f5f1eb] shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center min-w-[44px] min-h-[44px] group"
            >
              <div className="relative">
                <h1
                  className={`text-3xl font-bold tracking-[0.2em] transition-all duration-500 text-[#4a3f35]`}
                >
                  B2C
                </h1>
                <div
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r transition-all duration-500 from-[#c9a87c] to-[#6b5a4d] w-0 group-hover:w-full`}
                ></div>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 xl:space-x-12 absolute left-1/2 transform -translate-x-1/2">
              {/* Winter Collection Dropdown */}
              <div
                className="relative"
                ref={winterDropdownRef}
                onMouseEnter={() => setIsWinterDropdownOpen(true)}
                onMouseLeave={() => setIsWinterDropdownOpen(false)}
              >
                <Link
                  to="/products?collection=winter"
                  className="group relative text-xs font-semibold tracking-[0.15em] transition-all duration-300 whitespace-nowrap text-[#3d3228] hover:text-[#c9a87c] flex items-center space-x-1 py-2"
                >
                  <span>WINTER COLLECTION</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      isWinterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#c9a87c]`}
                  ></span>
                </Link>

                {isWinterDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 pt-2 w-[420px] z-50">
                    <div className="bg-gradient-to-br from-white via-[#faf8f5] to-[#f5f1eb] rounded-xl shadow-2xl border border-[#d4c5b0]/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a87c] via-[#b8956b] to-[#6b5a4d]"></div> */}
                      <div className="p-4">
                        <div className="text-xs font-bold text-[#8b7355] uppercase tracking-[0.2em] mb-3 px-2">
                          Shop by Category
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            to="/products?collection=winter&category=coats"
                            onClick={() => setIsWinterDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Wind className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Coats & Jackets
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Stay warm in style
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=winter&category=sweaters"
                            onClick={() => setIsWinterDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Shirt className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Sweaters
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Cozy essentials
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=winter&category=accessories"
                            onClick={() => setIsWinterDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Sparkles className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Accessories
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Complete the look
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=winter"
                            onClick={() => setIsWinterDropdownOpen(false)}
                            className="group relative bg-gradient-to-br from-[#c9a87c]/10 to-[#b8956b]/10 backdrop-blur-sm rounded-lg p-4 border border-[#c9a87c]/50 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/30 to-[#b8956b]/30 flex items-center justify-center grou:from-[#c9a87c]/40 group-hover:to-[#b8956b]/40 transition-all duration-300">
                                <Grid3x3 className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                View All
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Browse collection
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summer Collection Dropdown */}
              <div
                className="relative"
                ref={summerDropdownRef}
                onMouseEnter={() => setIsSummerDropdownOpen(true)}
                onMouseLeave={() => setIsSummerDropdownOpen(false)}
              >
                <Link
                  to="/products?collection=summer"
                  className="group relative text-xs font-semibold tracking-[0.15em] transition-all duration-300 whitespace-nowrap text-[#3d3228] hover:text-[#c9a87c] flex items-center space-x-1 py-2"
                >
                  <span>SUMMER COLLECTION</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      isSummerDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#c9a87c]`}
                  ></span>
                </Link>

                {isSummerDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 pt-2 w-[420px] z-50">
                    <div className="bg-gradient-to-br from-white via-[#faf8f5] to-[#f5f1eb] rounded-xl shadow-2xl border border-[#d4c5b0]/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a87c] via-[#b8956b] to-[#6b5a4d]"></div> */}
                      <div className="p-4">
                        <div className="text-xs font-bold text-[#8b7355] uppercase tracking-[0.2em] mb-3 px-2">
                          Shop by Category
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            to="/products?collection=summer&category=dresses"
                            onClick={() => setIsSummerDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Flower2 className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Dresses
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Effortless elegance
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=summer&category=tops"
                            onClick={() => setIsSummerDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Shirt className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Tops & Shirts
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Light & breezy
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=summer&category=shorts"
                            onClick={() => setIsSummerDropdownOpen(false)}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center group-hover:from-[#c9a87c]/30 group-hover:to-[#b8956b]/30 transition-all duration-300">
                                <Wind className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                Shorts & Skirts
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Summer staples
                              </div>
                            </div>
                          </Link>
                          <Link
                            to="/products?collection=summer"
                            onClick={() => setIsSummerDropdownOpen(false)}
                            className="group relative bg-gradient-to-br from-[#c9a87c]/10 to-[#b8956b]/10 backdrop-blur-sm rounded-lg p-4 border border-[#c9a87c]/50 hover:border-[#c9a87c] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a87c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            <div className="relative">
                              <div className="mb-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a87c]/30 to-[#b8956b]/30 flex items-center justify-center group-hover:from-[#c9a87c]/40 group-hover:to-[#b8956b]/40 transition-all duration-300">
                                <Sun className="w-5 h-5 text-[#6b5a4d] group-hover:text-[#c9a87c] transition-colors duration-300" />
                              </div>
                              <div className="text-sm font-semibold text-[#3d3228] group-hover:text-[#c9a87c] transition-colors duration-300">
                                View All
                              </div>
                              <div className="text-xs text-[#8b7355] mt-1">
                                Browse collection
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {user ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-2 text-xs font-medium tracking-wider transition-all duration-300 text-[#3d3228] hover:text-[#c9a87c] min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      <span>{user.fullName}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-4 w-52 bg-gradient-to-br from-white via-[#faf8f5] to-[#f5f1eb] rounded-xl shadow-2xl border border-[#d4c5b0]/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a87c] via-[#b8956b] to-[#6b5a4d]"></div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="group relative block px-4 py-3 text-sm text-[#3d3228] hover:text-[#c9a87c] rounded-lg transition-all duration-300 overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#e8dfd4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-between">
                              <span className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Profile
                              </span>
                              <span className="text-[#c9a87c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                →
                              </span>
                            </span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="group relative block px-4 py-3 text-sm text-[#3d3228] hover:text-[#c9a87c] rounded-lg transition-all duration-300 overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#e8dfd4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-between">
                              <span className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Orders
                              </span>
                              <span className="text-[#c9a87c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                →
                              </span>
                            </span>
                          </Link>
                          {isAdmin() && (
                            <>
                              <div className="h-px bg-gradient-to-r from-transparent via-[#d4c5b0]/50 to-transparent my-1"></div>
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="group relative block px-4 py-3 text-sm text-[#6b5a4d] hover:text-[#c9a87c] rounded-lg transition-all duration-300 overflow-hidden"
                              >
                                <span className="absolute inset-0 bg-gradient-to-r from-[#e8dfd4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center justify-between">
                                  <span className="flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    Admin
                                  </span>
                                  <span className="text-[#c9a87c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    →
                                  </span>
                                </span>
                              </Link>
                            </>
                          )}
                          <div className="h-px bg-gradient-to-r from-transparent via-[#d4c5b0]/50 to-transparent my-1"></div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="group relative block w-full text-left px-4 py-3 text-sm text-[#8b7355] hover:text-[#c9a87c] rounded-lg transition-all duration-300 overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-[#e8dfd4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-between">
                              <span className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a87c] mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Logout
                              </span>
                              <span className="text-[#c9a87c] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                →
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-xs font-medium tracking-wider transition-all duration-300 text-[#3d3228] hover:text-[#c9a87c]"
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/register"
                      className="text-xs font-medium tracking-wider transition-all duration-300 text-[#3d3228] hover:text-[#c9a87c]"
                    >
                      REGISTER
                    </Link>
                  </>
                )}
              </div>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative group p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 rounded-full text-[#3d3228] hover:bg-[#e8dfd4] hover:text-[#c9a87c]"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#c9a87c] to-[#b8956b] text-white text-xs font-bold min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300 rounded-full text-[#3d3228] hover:bg-[#e8dfd4]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu - Slide-in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-[#f5f1eb] via-[#f8f5f0] to-[#faf8f5] shadow-2xl z-[45] md:hidden transform transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#d4c5b0]/30 bg-white/40 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[#6b5a4d] tracking-wider">
              MENU
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-[#e8dfd4] rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center group"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-[#6b5a4d] group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex flex-col p-6 space-y-1 overflow-y-auto">
            <div className="pb-4 mb-4 border-b border-[#d4c5b0]/30">
              <p className="text-xs font-bold text-[#8b7355] uppercase tracking-[0.2em] px-4 mb-3">
                Collections
              </p>

              {/* Winter Collection Mobile Dropdown */}
              <div className="mb-2">
                <button
                  onClick={() => setIsMobileWinterOpen(!isMobileWinterOpen)}
                  className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center justify-between w-full relative overflow-hidden"
                >
                  <span className="relative z-10">WINTER COLLECTION</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                      isMobileWinterOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>

                {isMobileWinterOpen && (
                  <div className="mt-2 bg-white/40 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-xs font-bold text-[#8b7355] uppercase tracking-[0.2em] mb-2 px-2">
                      Shop by Category
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/products?collection=winter&category=coats"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Wind className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Coats & Jackets
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Stay warm in style
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=winter&category=sweaters"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Shirt className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Sweaters
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Cozy essentials
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=winter&category=accessories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Accessories
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Complete the look
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=winter"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-gradient-to-br from-[#c9a87c]/10 to-[#b8956b]/10 backdrop-blur-sm rounded-lg p-3 border border-[#c9a87c]/50 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/30 to-[#b8956b]/30 flex items-center justify-center flex-shrink-0">
                          <Grid3x3 className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            View All
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Browse collection
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Summer Collection Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileSummerOpen(!isMobileSummerOpen)}
                  className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center justify-between w-full relative overflow-hidden"
                >
                  <span className="relative z-10">SUMMER COLLECTION</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                      isMobileSummerOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </button>

                {isMobileSummerOpen && (
                  <div className="mt-2 bg-white/40 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-xs font-bold text-[#8b7355] uppercase tracking-[0.2em] mb-2 px-2">
                      Shop by Category
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/products?collection=summer&category=dresses"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Flower2 className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Dresses
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Effortless elegance
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=summer&category=tops"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Shirt className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Tops & Shirts
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Light & breezy
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=summer&category=shorts"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-[#d4c5b0]/30 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/20 to-[#b8956b]/20 flex items-center justify-center flex-shrink-0">
                          <Wind className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            Shorts & Skirts
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Summer staples
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products?collection=summer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group relative bg-gradient-to-br from-[#c9a87c]/10 to-[#b8956b]/10 backdrop-blur-sm rounded-lg p-3 border border-[#c9a87c]/50 hover:border-[#c9a87c] transition-all duration-300 flex items-start"
                      >
                        <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a87c]/30 to-[#b8956b]/30 flex items-center justify-center flex-shrink-0">
                          <Sun className="w-4 h-4 text-[#6b5a4d]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#3d3228]">
                            View All
                          </div>
                          <div className="text-xs text-[#8b7355]">
                            Browse collection
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {user && (
              <Link
                to="/orders"
                className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center relative overflow-hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">ORDERS</span>
                <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </Link>
            )}
            {isAdmin() && (
              <Link
                to="/admin"
                className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center relative overflow-hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">ADMIN</span>
                <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </Link>
            )}
            <div className="border-t border-[#d4c5b0]/30 pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center block relative overflow-hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">{user.fullName}</span>
                    <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="group text-sm font-medium text-[#8b7355] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center w-full text-left relative overflow-hidden"
                  >
                    <span className="relative z-10">Logout</span>
                    <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center block relative overflow-hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">LOGIN</span>
                    <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Link>
                  <Link
                    to="/register"
                    className="group text-sm font-medium text-[#6b5a4d] py-3 px-4 hover:bg-gradient-to-r hover:from-[#e8dfd4] hover:to-transparent rounded-lg transition-all duration-300 min-h-[44px] flex items-center block relative overflow-hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">REGISTER</span>
                    <span className="absolute left-0 top-0 h-full w-1 bg-[#c9a87c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
