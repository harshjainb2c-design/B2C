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
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed right-0 top-0 h-screen h-[100dvh] max-h-[100dvh] w-full sm:max-w-md bg-black z-50 flex flex-col text-white select-none overflow-hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-900 bg-black z-10">
          <h2 id="cart-drawer-title" className="text-sm uppercase tracking-wider text-white font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Bag ({itemCount})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 text-white"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-none overscroll-contain">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="w-10 h-10 text-neutral-700 mb-3" />
              <h3 className="text-sm uppercase text-white font-bold mb-1">
                Your Bag Is Empty
              </h3>
              <p className="text-xs text-neutral-400 mb-5">
                Explore the latest drops to fill it up
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white rounded-sm"
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
          <div className="flex-shrink-0 border-t border-neutral-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5 bg-black z-10">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">Subtotal</span>
              <span className="text-base font-bold text-white">
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
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-sm"
            >
              Checkout Now
            </button>

            <button
              type="button"
              onClick={handleViewCart}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 rounded-sm"
            >
              View Shopping Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
};
