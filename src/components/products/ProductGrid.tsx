import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/LoadingSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 sm:py-24 text-center max-w-md mx-auto flex flex-col items-center select-none font-inter">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mb-5 text-neutral-400">
          <svg
            className="h-7 w-7 stroke-[1.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
          No Products Found
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto mb-6 leading-relaxed">
          We couldn't find any products matching your active filters or search terms.
        </p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-white text-black text-xs font-inter font-bold uppercase tracking-wider border border-white hover:bg-neutral-200 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};
