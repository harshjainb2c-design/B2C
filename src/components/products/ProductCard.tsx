import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductImage } from '../common/ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <>
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
        className="relative w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-warmBrown focus:ring-offset-2"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-sand">
          {product.images && product.images.length > 0 ? (
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              className=""
              loading="lazy"
              aspectRatio="square"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-taupe text-xs">
              No Image
            </div>
          )}
          
          {/* Stock Badges */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
              <span className="text-warmBrown font-semibold text-xs md:text-sm">Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="absolute top-2 left-2 bg-terracotta text-white text-[10px] md:text-xs px-2 md:px-3 py-1 font-bold rounded-full shadow-lg">
              LOW STOCK
            </div>
          )}
        </div>

        {/* Floating Product Info - Attached to bottom of image */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-lg p-3 md:p-4 shadow-lg">
          {/* Product Name */}
          <h3 className="text-xs md:text-sm font-semibold text-warmBrown line-clamp-2 leading-tight min-h-[24px]">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm md:text-base lg:text-lg font-bold text-terracotta">
              {formatPrice(product.price)}
            </span>
            {hasSizes && product.sizes && (
              <span className="text-[10px] md:text-xs text-taupe font-medium">
                {product.sizes.length} sizes
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleViewDetails}
            aria-label={`View details for ${product.name}`}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs md:text-sm font-bold text-white bg-warmBrown focus:outline-none focus:ring-2 focus:ring-warmBrown focus:ring-offset-2 rounded-lg shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </>
  );
};
