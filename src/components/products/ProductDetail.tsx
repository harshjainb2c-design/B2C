import { useState } from 'react';
import { Product } from '../../types/product';
import { ProductImage } from '../common/ProductImage';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number, size?: string) => void;
}

export const ProductDetail = ({ product, onAddToCart }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 10);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isOutOfStock && onAddToCart) {
      // Check if size is required but not selected
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        return; // Don't add to cart if size is required but not selected
      }
      
      setIsAddingToCart(true);
      try {
        await onAddToCart(product, quantity, selectedSize || undefined);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const canAddToCart = !isOutOfStock && (!hasSizes || selectedSize);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mobile: Stack vertically, Tablet+: Side-by-side layout */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Image Gallery - Full width on mobile, half width on tablet+ */}
        <div className="w-full lg:w-1/2">
          {/* Main Image */}
          <div className="touch-manipulation">
            {product.images && product.images.length > 0 ? (
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                className="rounded-lg mb-2 sm:mb-3 shadow-md"
                loading="eager"
                aspectRatio="square"
              />
            ) : (
              <div className="aspect-square bg-sand rounded-lg mb-2 sm:mb-3 shadow-md flex items-center justify-center text-taupe text-sm">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnail Images - Touch-friendly on mobile */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded border-2 transition-all duration-200 touch-manipulation min-h-[44px] shadow-sm ${
                    selectedImage === index
                      ? 'border-terracotta ring-2 ring-terracotta ring-opacity-30'
                      : 'border-beige-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    loading="lazy"
                    aspectRatio="square"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information - Full width on mobile, half width on tablet+ */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold text-warmBrown bg-sand rounded-full capitalize tracking-wide">
              {product.category}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-warmBrown mb-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-beige-200">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-terracotta">
              {formatPrice(product.price)}
            </span>
            {isOutOfStock ? (
              <span className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-red-600 bg-red-50 rounded-full border border-red-200">
                Out of Stock
              </span>
            ) : product.stock <= 10 ? (
              <span className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-orange-600 bg-orange-50 rounded-full border border-orange-200">
                Only {product.stock} left
              </span>
            ) : (
              <span className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 rounded-full border border-green-200">
                In Stock
              </span>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-bold text-warmBrown mb-2">Description</h3>
            <p className="text-xs sm:text-sm text-taupe leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-4 bg-sand/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold text-warmBrown mb-3">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <dt className="text-xs sm:text-sm font-medium text-taupe capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-xs sm:text-sm font-semibold text-warmBrown">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Size Selector */}
          {hasSizes && !isOutOfStock && (
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-bold text-warmBrown mb-2">
                Select Size *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg border-2 transition-all duration-200 touch-manipulation min-h-[44px] ${
                      selectedSize === size
                        ? 'border-warmBrown bg-warmBrown text-white shadow-lg'
                        : 'border-beige-300 text-warmBrown'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector - Touch-friendly controls */}
          {!isOutOfStock && (
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-bold text-warmBrown mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-beige-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation text-warmBrown shadow-sm"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min={1}
                  max={maxQuantity}
                  className="w-16 sm:w-20 px-2 sm:px-4 py-2 sm:py-3 text-center text-base sm:text-lg font-bold border-2 border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta touch-manipulation text-warmBrown shadow-sm"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-beige-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation text-warmBrown shadow-sm"
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button - Adequate touch target (min 44px height) */}
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAddingToCart}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-terracotta disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-beige-400 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[52px] rounded-lg shadow-lg uppercase tracking-wide flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : hasSizes && !selectedSize ? (
              'Select a Size'
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
