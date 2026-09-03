import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/products/ProductCard";

export const Home = () => {
  const navigate = useNavigate();
  
  // Different queries for each section
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ 
    limit: 8,
    page: 1 
  });
  
  const { data: trendingData, isLoading: trendingLoading } = useProducts({ 
    limit: 8,
    page: 2 
  });
  
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useProducts({ 
    limit: 8,
    page: 3 
  });
  
  const { data: bestSellersData, isLoading: bestSellersLoading } = useProducts({ 
    limit: 8,
    page: 4 
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative bg-sand min-h-[85vh] sm:min-h-screen flex items-center -mt-16 pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-in zoom-in duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601754664414-aa3e4f42e6d4?w=1920&h=1080&fit=crop&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center max-w-5xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 tracking-[0.3em] font-bold uppercase bg-gradient-to-r from-[#f5d5a8] via-white to-[#f5d5a8] bg-clip-text text-transparent animate-in fade-in duration-1000 delay-200">
              Redefining the Gen-Z Wardrobe
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1.15] pb-4 bg-gradient-to-r from-white via-[#f5f1eb] to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              Trendy. Affordable. Unapologetic.
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-light bg-gradient-to-r from-white/90 via-white to-white/90 bg-clip-text text-transparent drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 sm:mt-4 duration-700 delay-500">
              Your fashion revolution starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <Link
                to="/products"
                className="group relative inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm md:text-base font-bold text-white bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] hover:from-[#a08264] hover:to-[#8b7355] transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:scale-105 uppercase tracking-wider rounded overflow-hidden"
              >
                <span className="relative z-10">SHOP NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              <Link
                to="/products"
                className="group relative inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm md:text-base font-bold text-white border-2 border-white/80 hover:border-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.2)] hover:scale-105 uppercase tracking-wider rounded overflow-hidden"
              >
                <span className="relative z-10">VIEW COLLECTION</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#3d3228] mb-2 sm:mb-3 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#8b7355] font-medium">
              Explore our curated collections
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {[
              {
                name: "Upper Wear",
                category: "upper",
                description: "T-Shirts, Shirts & More",
                image:
                  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop&q=80",
              },
              {
                name: "Bottom Wear",
                category: "bottom",
                description: "Jeans, Cargo & Trousers",
                image:
                  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop&q=80",
              },
              {
                name: "Footwear",
                category: "shoes",
                description: "Sneakers, Casual & Formal",
                image:
                  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=800&fit=crop&q=80",
              },
            ].map((item) => (
              <Link
                key={item.category}
                to={`/products?category=${item.category}`}
                className="group relative overflow-hidden rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center p-4 sm:p-5 md:p-6 lg:p-8 transform group-hover:translate-y-[-8px] transition-transform duration-500">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full border border-white/30 group-hover:bg-white/20 group-hover:border-white/50 transition-all duration-300">
                      SHOP NOW
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-[#f5f1eb] to-[#ebe3d5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#3d3228] tracking-tight">
                Featured Collection
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#8b7355] mt-1 sm:mt-2 font-medium">
                Handpicked styles just for you
              </p>
            </div>
            <Link
              to="/products"
              className="group text-[#6b5a4d] hover:text-[#c9a87c] font-bold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-all duration-300 hover:gap-3"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#e8dfd4] rounded-xl mb-3 shadow-md"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded mb-2"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredData?.products && featuredData.products.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 scroll-smooth">
                <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-6 px-4 sm:px-0">
                  {featuredData.products.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="cursor-pointer flex-shrink-0 w-[145px] sm:w-[185px] md:w-[225px] lg:w-[265px] xl:w-[285px] animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-[#8b7355]">
                No products available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Now Carousel */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#3d3228] tracking-tight">
                Trending Now
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#8b7355] mt-1 sm:mt-2 font-medium">
                What everyone's loving
              </p>
            </div>
            <Link
              to="/products?sort=popular"
              className="group text-[#6b5a4d] hover:text-[#c9a87c] font-bold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-all duration-300 hover:gap-3"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#e8dfd4] rounded-xl mb-3 shadow-md"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded mb-2"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : trendingData?.products && trendingData.products.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 scroll-smooth">
                <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-6 px-4 sm:px-0">
                  {trendingData.products.map((product, index) => (
                    <div
                      key={`trending-${product.id}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="cursor-pointer flex-shrink-0 w-[145px] sm:w-[185px] md:w-[225px] lg:w-[265px] xl:w-[285px] animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-[#8b7355]">
                No products available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-[#f5f1eb] to-[#ebe3d5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#3d3228] tracking-tight">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#8b7355] mt-1 sm:mt-2 font-medium">
                Fresh styles, just landed
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="group text-[#6b5a4d] hover:text-[#c9a87c] font-bold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-all duration-300 hover:gap-3"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {newArrivalsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#e8dfd4] rounded-xl mb-3 shadow-md"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded mb-2"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : newArrivalsData?.products && newArrivalsData.products.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 scroll-smooth">
                <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-6 px-4 sm:px-0">
                  {newArrivalsData.products.map((product, index) => (
                    <div
                      key={`new-${product.id}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="cursor-pointer flex-shrink-0 w-[145px] sm:w-[185px] md:w-[225px] lg:w-[265px] xl:w-[285px] animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-[#8b7355]">
                No products available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#3d3228] tracking-tight">
                Best Sellers
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#8b7355] mt-1 sm:mt-2 font-medium">
                Customer favorites
              </p>
            </div>
            <Link
              to="/products?sort=bestselling"
              className="group text-[#6b5a4d] hover:text-[#c9a87c] font-bold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-all duration-300 hover:gap-3"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {bestSellersLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#e8dfd4] rounded-xl mb-3 shadow-md"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded mb-2"></div>
                  <div className="h-4 bg-[#e8dfd4] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : bestSellersData?.products && bestSellersData.products.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 scroll-smooth">
                <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-6 px-4 sm:px-0">
                  {bestSellersData.products.map((product, index) => (
                    <div
                      key={`bestseller-${product.id}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="cursor-pointer flex-shrink-0 w-[145px] sm:w-[185px] md:w-[225px] lg:w-[265px] xl:w-[285px] animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-[#8b7355]">
                No products available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#6b5a4d] via-[#7d6656] to-[#8b7355] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3djFoLTd2LTF6bTE0IDBoN3YxaC03di0xem0xNCAwaDd2MWgtN3YtMXptMTQgMGg3djFoLTd2LTF6bTE0IDBoN3YxaC03di0xem0xNCAwaDd2MWgtN3YtMXptMTQgMGg3djFoLTd2LTF6bTE0IDBoN3YxaC03di0xeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2IC0xMzQpIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 tracking-tight drop-shadow-lg">
            Wholesale & Retail Available
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/95 max-w-2xl mx-auto font-medium">
            Contact us for bulk orders and special wholesale rates. Serving Indore since 2018!
          </p>
          <Link
            to="/products"
            className="group inline-block px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-[#3d3228] bg-white hover:bg-[#f5f1eb] transition-all duration-300 rounded-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:scale-105 uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              VIEW PRODUCTS
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#c9a87c] mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#3d3228] mb-0.5 sm:mb-1">
                Wholesale Prices
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8b7355]">
                Best rates in Indore
              </p>
            </div>

            <div className="text-center">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#c9a87c] mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#3d3228] mb-0.5 sm:mb-1">
                Local Delivery
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8b7355]">
                Fast delivery in Indore
              </p>
            </div>

            <div className="text-center">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#c9a87c] mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#3d3228] mb-0.5 sm:mb-1">
                Secure Payment
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8b7355]">
                100% secure
              </p>
            </div>

            <div className="text-center">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#c9a87c] mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#3d3228] mb-0.5 sm:mb-1">
                Easy Returns
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8b7355]">
                30-day policy
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
