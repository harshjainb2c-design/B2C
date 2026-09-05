import { useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { CartDrawerItem } from './CartDrawerItem';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-black border-l border-neutral-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col text-white select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-black">
          <h2 id="cart-drawer-title" className="text-sm font-mono uppercase tracking-[0.2em] text-white font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Bag ({itemCount})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 text-neutral-700 mb-4" />
              <h3 className="text-base font-mono uppercase text-white font-bold mb-1">
                Your Bag Is Empty
              </h3>
              <p className="text-xs font-mono text-neutral-400 mb-6">
                Explore the latest drops to fill it up
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-900">
              {items.map((item) => {
                const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
                return (
                  <CartDrawerItem
                    key={itemKey}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-800 p-5 space-y-3 bg-black">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Subtotal</span>
              <span className="text-lg font-mono font-bold text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-[0.16em] text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Checkout Now
            </button>

            <button
              type="button"
              onClick={handleViewCart}
              className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-[0.16em] text-white bg-black border border-neutral-800 hover:border-white transition-colors"
            >
              View Shopping Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
};
