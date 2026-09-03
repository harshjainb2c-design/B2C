import { CartItem as CartItemType } from '../../types/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemove: (productId: string, size?: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1, item.size);
    }
  };

  const handleIncrement = () => {
    const newQuantity = item.quantity + 1;
    if (newQuantity <= item.product.stock) {
      onUpdateQuantity(item.productId, newQuantity, item.size);
    }
  };

  const isMaxQuantity = item.quantity >= item.product.stock;
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200">
      {/* Mobile: Image and Price Row */}
      <div className="flex gap-4 sm:contents">
        {/* Product Image */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-md overflow-hidden">
          {item.product.images && item.product.images.length > 0 ? (
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between sm:flex-row sm:items-start">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
              {item.product.name}
            </h3>
            {item.size && (
              <p className="text-xs text-gray-600 mb-1">
                Size: <span className="font-semibold text-warmBrown">{item.size}</span>
              </p>
            )}
            <p className="text-xs sm:text-sm text-gray-600">
              {formatPrice(item.price)} each
            </p>
            {item.product.stock <= 10 && (
              <p className="text-xs text-orange-600 mt-1">
                Only {item.product.stock} available
              </p>
            )}
          </div>

          {/* Item Total - Desktop only */}
          <div className="hidden sm:block flex-shrink-0 text-right ml-4">
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Quantity Controls and Actions Row */}
      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 sm:ml-28">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-3 sm:px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isMaxQuantity}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.productId, item.size)}
          className="w-11 h-11 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors touch-manipulation"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Item Total - Mobile only */}
        <div className="sm:hidden flex-1 text-right">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
};
