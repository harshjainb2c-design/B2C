import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      className="cursor-pointer flex flex-col bg-transparent select-none focus:outline-none font-inter"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 rounded-lg border border-white/10">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-inter text-xs">
            NO IMAGE
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <span className="text-white font-inter font-bold text-xs uppercase tracking-wider border border-white/30 px-3 py-1 rounded-full bg-black/80">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      <div className="pt-2 px-0.5 text-left font-inter">
        <div className="text-xs sm:text-[13px] text-neutral-200 font-normal truncate">
          {product.name}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
