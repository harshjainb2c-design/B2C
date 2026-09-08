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
    <div className="flex gap-3.5 py-3.5 bg-black text-white">
      <div className="flex-shrink-0 w-16 h-20 bg-neutral-950 rounded-sm overflow-hidden">
        {item.product.images && item.product.images.length > 0 ? (
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-[10px]">
            NO IMAGE
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-xs font-semibold text-white line-clamp-1">
              {item.product.name}
            </h3>
            <button
              type="button"
              onClick={() => onRemove(item.productId, item.size)}
              className="flex-shrink-0 p-1 text-neutral-500 text-neutral-300"
              aria-label="Remove item"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {item.size && (
            <p className="text-[11px] text-neutral-400 mb-1">
              Size: <span className="text-white font-bold">{item.size}</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center border border-neutral-900 rounded-sm bg-black">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                className="w-6 h-6 flex items-center justify-center text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-white min-w-[1.5rem] text-center">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isMaxQuantity}
                className="w-6 h-6 flex items-center justify-center text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs font-bold text-white">
              {formatPrice(itemTotal)}
            </p>
          </div>

          {item.product.stock <= 10 && (
            <p className="text-[10px] text-amber-400 mt-1">
              Only {item.product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
