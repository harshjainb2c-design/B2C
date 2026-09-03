import { CartItem as CartItemType } from '../../types/cart';
import { Minus, Plus, X } from 'lucide-react';

interface CartDrawerItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemove: (productId: string, size?: string) => void;
}

export const CartDrawerItem = ({ item, onUpdateQuantity, onRemove }: CartDrawerItemProps) => {
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
    <div className="flex gap-3 py-3 border-b border-gray-200 last:border-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded overflow-hidden">
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
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {item.product.name}
          </h3>
          <button
            onClick={() => onRemove(item.productId, item.size)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {item.size && (
          <p className="text-xs text-gray-600 mb-1">
            Size: <span className="font-semibold">{item.size}</span>
          </p>
        )}

        <p className="text-xs text-gray-600 mb-2">
          {formatPrice(item.price)} each
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isMaxQuantity}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Item Total */}
          <p className="text-sm font-bold text-gray-900">
            {formatPrice(itemTotal)}
          </p>
        </div>

        {item.product.stock <= 10 && (
          <p className="text-xs text-orange-600 mt-1">
            Only {item.product.stock} left
          </p>
        )}
      </div>
    </div>
  );
};
