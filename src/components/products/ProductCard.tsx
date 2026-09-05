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
      className="group cursor-pointer flex flex-col bg-transparent select-none focus:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 select-none"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-mono text-xs">
            NO IMAGE
          </div>
        )}
        
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.14em] text-white uppercase leading-none border-l-2 border-white pl-1.5 drop-shadow">
            {product.category || 'OVERSIZED'}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <span className="text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/40 px-3 py-1 bg-black/60">
              OUT OF STOCK
            </span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 bg-red-600/90 text-[9px] font-mono font-bold text-white uppercase tracking-wider">
              LOW STOCK
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 pb-2 px-1 text-left">
        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 mb-0.5">
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-white/90 font-normal mb-1.5 capitalize">
          {product.category || 'Streetwear'}
        </p>
        <span className="text-xs sm:text-sm font-extrabold text-white">
          ₹ {product.price.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};
