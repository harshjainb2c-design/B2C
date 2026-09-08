import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductDetail, ProductCard } from '../components/products';
import { Product } from '../types/product';
import { useToast } from '../hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoryCarouselRef = useRef<HTMLDivElement>(null);
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: relatedData } = useProducts({ 
    limit: 8, 
    category: product?.category 
  });

  const exploreCategories = [
    { id: 'sneakers', name: 'SNEAKERS', image: '/sneakers.png?v=1', path: '/products?category=footwear' },
    { id: 't-shirts', name: 'T-SHIRTS', image: '/tshirt-men.png', path: '/products?category=t-shirts' },
    { id: 'pants', name: 'PANTS', image: '/pants-men.png?v=1', path: '/products?category=pants', position: 'object-bottom' },
    { id: 'shirts', name: 'SHIRTS', image: '/shirt-men.png', path: '/products?category=shirts' },
    { id: 'jeans', name: 'JEANS', image: '/jeans-men.png?v=3', path: '/products?category=jeans', position: 'object-bottom' },
    { id: 'joggers', name: 'JOGGERS', image: '/joggers-men.png?v=1', path: '/products?category=joggers', position: 'object-bottom' },
    { id: 'polos', name: 'POLOS', image: '/polo-men.png', path: '/products?category=polos' },
    { id: 'high-tops', name: 'HIGH TOPS', image: '/hightops.jpg?v=1', path: '/products?category=footwear' },
    { id: 'clogs', name: 'CLOGS', image: '/clogs.jpg?v=1', path: '/products?category=footwear' },
    { id: 'hoodies', name: 'HOODIES', image: '/hoodie-women.jpg?v=1', path: '/products?category=hoodies' },
  ];

  const handleAddToCart = async (product: Product, quantity: number, size?: string) => {
    try {
      await addItem(product, quantity, size);
      const sizeText = size ? ` (Size: ${size})` : '';
      toast({
        title: 'Added to Bag',
        description: `Added ${quantity}x ${product.name}${sizeText} to your shopping bag.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollCategoryCarousel = (direction: 'left' | 'right') => {
    if (categoryCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const suggestedProducts = relatedData?.products?.filter((p) => p.id !== id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white select-none font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-14 items-start">
            <div className="w-full lg:w-[58%] flex flex-col gap-4">
              <div className="hidden lg:grid grid-cols-2 gap-3.5 sm:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-neutral-900 rounded-lg animate-pulse overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
                  </div>
                ))}
              </div>

              <div className="lg:hidden flex flex-col gap-3 w-full">
                <div className="aspect-[3/4] w-full bg-neutral-900 rounded-lg animate-pulse overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-16 h-20 bg-neutral-900 rounded-lg animate-pulse shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[42%] space-y-4">
              <div className="h-4 bg-neutral-900 rounded w-24 animate-pulse" />
              <div className="h-8 bg-neutral-900 rounded-lg w-3/4 animate-pulse" />
              <div className="h-6 bg-neutral-900 rounded-lg w-1/3 animate-pulse" />
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-neutral-900 rounded w-full animate-pulse" />
                <div className="h-3 bg-neutral-900 rounded w-4/5 animate-pulse" />
              </div>
              <div className="flex gap-2 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-12 h-10 bg-neutral-900 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="h-12 bg-neutral-900 rounded-lg animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white select-none font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
              Product Not Found
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              {error ? error.message : "The requested product is unavailable or does not exist."}
            </p>
            <button
              type="button"
              onClick={handleBackToProducts}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-inter font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white select-none font-inter">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 pb-24 sm:py-10">
        <ProductDetail product={product} onAddToCart={handleAddToCart} />

        {suggestedProducts.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-6 border-t border-white/10 pb-6 sm:pb-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
              <div>
                <h2 className="font-headline text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight">
                  Others Also Bought
                </h2>
                <p className="text-[11px] sm:text-xs font-inter font-medium tracking-wider text-neutral-400 uppercase mt-0.5">
                  Recommended Products
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
            >
              {suggestedProducts.map((item, idx) => (
                <div
                  key={item.id}
                  className={`w-[140px] sm:w-[180px] md:w-[220px] shrink-0 ${
                    idx === 0 ? 'ml-4 sm:ml-0' : ''
                  } ${idx === suggestedProducts.length - 1 ? 'mr-4 sm:mr-0' : ''}`}
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 pb-6 sm:pb-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
            <div>
              <h2 className="font-headline text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight">
                Explore Categories
              </h2>
              <p className="text-[11px] sm:text-xs font-inter font-medium tracking-wider text-neutral-400 uppercase mt-0.5">
                Curated Streetwear & Footwear
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollCategoryCarousel('left')}
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategoryCarousel('right')}
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={categoryCarouselRef}
            className="flex gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
          >
            {exploreCategories.map((cat, idx) => (
              <div
                key={cat.id}
                onClick={() => navigate(cat.path)}
                className={`cursor-pointer flex flex-col items-center shrink-0 w-[110px] sm:w-[130px] md:w-[150px] ${
                  idx === 0 ? 'ml-4 sm:ml-0' : ''
                } ${idx === exploreCategories.length - 1 ? 'mr-4 sm:mr-0' : ''}`}
              >
                <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-900 rounded-lg border border-white/10">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-full h-full object-cover select-none ${cat.position || 'object-center'}`}
                    loading="lazy"
                  />
                </div>
                <h3 className="font-inter font-bold text-[10px] sm:text-xs tracking-[0.1em] uppercase text-neutral-200 text-center mt-1.5 sm:mt-2 truncate w-full px-0.5">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
