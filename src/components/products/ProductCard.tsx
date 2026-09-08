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
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-2xl border border-white/10">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center select-none"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-inter text-xs">
            NO IMAGE
          </div>
        )}
        
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-inter font-bold tracking-[0.14em] text-white uppercase leading-none px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
            {product.category || 'OVERSIZED'}
          </span>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <span className="text-white font-inter font-bold text-xs uppercase tracking-wider border border-white/40 px-3.5 py-1.5 rounded-full bg-black/70">
              OUT OF STOCK
            </span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 bg-red-600 rounded-full text-[9px] font-inter font-bold text-white uppercase tracking-wider">
              LOW STOCK
            </span>
          </div>
        )}
      </div>

      <div className="pt-2.5 pb-1 px-1 text-left font-inter">
        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 mb-0.5">
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-neutral-400 font-normal mb-1 capitalize">
          {product.category || 'Streetwear'}
        </p>
        <span className="text-xs sm:text-sm font-extrabold text-white">
          ₹ {product.price.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
};
