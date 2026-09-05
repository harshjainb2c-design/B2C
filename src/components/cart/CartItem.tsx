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
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-neutral-800 bg-black text-white">
      <div className="flex gap-4 sm:contents">
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-neutral-950 border border-neutral-800 overflow-hidden">
          {item.product.images && item.product.images.length > 0 ? (
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-mono">
              NO IMAGE
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between sm:flex-row sm:items-start">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              {item.product.name}
            </h3>
            {item.size && (
              <p className="text-xs font-mono text-neutral-400 mb-1">
                Size: <span className="text-white font-bold">{item.size}</span>
              </p>
            )}
            <p className="text-xs font-mono text-neutral-400">
              {formatPrice(item.price)} each
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-4 mt-3 sm:mt-0">
            <div className="flex items-center border border-neutral-800 bg-black">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 text-xs font-mono font-bold text-white min-w-[28px] text-center">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isMaxQuantity}
                className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {formatPrice(itemTotal)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.productId, item.size)}
                className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
