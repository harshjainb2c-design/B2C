import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductDetail } from '../components/products';
import { Product } from '../types/product';
import { useToast } from '../hooks/use-toast';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useProduct(id || '');

  const handleAddToCart = async (product: Product, quantity: number, size?: string) => {
    try {
      await addItem(product, quantity, size);
      // Show success feedback with toast
      const sizeText = size ? ` (Size: ${size})` : '';
      toast({
        title: 'Success',
        description: `Added ${quantity}x ${product.name}${sizeText} to cart!`,
      });
    } catch (error) {
      // Show error feedback with toast
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-10 w-32 bg-sand rounded animate-pulse" />
          </div>

          {/* Product Detail Skeleton */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Image Skeleton */}
              <div>
                <div className="aspect-square bg-sand rounded-lg animate-pulse mb-4" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-sand rounded-md animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Info Skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-sand rounded w-3/4 animate-pulse" />
                <div className="h-10 bg-sand rounded w-1/2 animate-pulse" />
                <div className="h-6 bg-sand rounded w-1/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-sand rounded animate-pulse" />
                  <div className="h-4 bg-sand rounded animate-pulse" />
                  <div className="h-4 bg-sand rounded w-2/3 animate-pulse" />
                </div>
                <div className="h-12 bg-sand rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBackToProducts}
              className="flex items-center gap-2 px-4 py-2 text-warmBrown border border-warmBrown hover:bg-warmBrown hover:text-white transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Products
            </button>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading product
                </h3>
                <p className="text-xs text-red-700 mt-2">
                  {error.message || 'Product not found'}
                </p>
                <button
                  onClick={handleBackToProducts}
                  className="mt-4 px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-100"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-warmBrown mb-2">
              Product not found
            </h2>
            <p className="text-sm text-taupe mb-6">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={handleBackToProducts}
              className="px-6 py-2.5 text-sm font-medium text-white bg-warmBrown hover:bg-taupe transition-all duration-100"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleBackToProducts}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-warmBrown border-2 border-warmBrown rounded-lg text-xs sm:text-sm font-semibold shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </button>
        </div>

        {/* Product Detail */}
        <ProductDetail product={product} onAddToCart={handleAddToCart} />

        {/* Additional Information */}
        <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-warmBrown mb-1">Free Shipping</h3>
                <p className="text-xs sm:text-sm text-taupe">
                  On orders over ₹2000
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-warmBrown mb-1">Secure Payment</h3>
                <p className="text-xs sm:text-sm text-taupe">
                  100% secure transactions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sand rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-warmBrown mb-1">Easy Returns</h3>
                <p className="text-xs sm:text-sm text-taupe">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
