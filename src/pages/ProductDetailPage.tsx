import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductDetail, ProductCard } from '../components/products';
import { Product } from '../types/product';
import { useToast } from '../hooks/use-toast';
import { ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: relatedData } = useProducts({ 
    limit: 8, 
    category: product?.category 
  });

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

  const suggestedProducts = relatedData?.products?.filter((p) => p.id !== id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6">
            <div className="h-9 w-36 bg-neutral-900 animate-pulse" />
          </div>

          <div className="bg-black border border-neutral-900 p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="aspect-[3/4] bg-neutral-900 animate-pulse mb-4" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-neutral-900 animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-6 bg-neutral-900 w-24 animate-pulse" />
                <div className="h-10 bg-neutral-900 w-3/4 animate-pulse" />
                <div className="h-8 bg-neutral-900 w-1/3 animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-neutral-900 animate-pulse" />
                  <div className="h-3 bg-neutral-900 animate-pulse" />
                  <div className="h-3 bg-neutral-900 w-2/3 animate-pulse" />
                </div>
                <div className="h-14 bg-neutral-900 animate-pulse mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <div className="max-w-md mx-auto bg-black border border-neutral-900 p-8 sm:p-10">
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mb-2">
              Product Not Found
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              {error ? error.message : "The requested archive piece is unavailable or does not exist."}
            </p>
            <button
              type="button"
              onClick={handleBackToProducts}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <button
            type="button"
            onClick={handleBackToProducts}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 bg-black border border-neutral-800 hover:border-white hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </button>
        </div>

        <ProductDetail product={product} onAddToCart={handleAddToCart} />

        {suggestedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-neutral-900">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                  Others Also Bought
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  Recommended Streetwear Drops
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-800 bg-black hover:border-white text-white flex items-center justify-center transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-800 bg-black hover:border-white text-white flex items-center justify-center transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {suggestedProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="w-[240px] sm:w-[280px] shrink-0 snap-start bg-black border border-neutral-900 p-2.5 hover:border-neutral-700 transition-colors"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black border border-neutral-800 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-black border border-neutral-800 flex items-center justify-center text-white shrink-0">
              <Truck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-1">
                Fast Express Delivery
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Direct in Indore & nationwide dispatch in 24-48h
              </p>
            </div>
          </div>

          <div className="bg-black border border-neutral-800 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-black border border-neutral-800 flex items-center justify-center text-white shrink-0">
              <Shield className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-1">
                100% Authentic Quality
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Signature export cottons and custom heavyweight GSM
              </p>
            </div>
          </div>

          <div className="bg-black border border-neutral-800 p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-black border border-neutral-800 flex items-center justify-center text-white shrink-0">
              <RotateCcw className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-1">
                Easy 30-Day Policy
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Hassle-free size exchange and support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
