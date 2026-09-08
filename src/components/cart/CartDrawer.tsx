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
        className={`fixed right-0 top-0 h-screen h-[100dvh] max-h-[100dvh] w-full sm:max-w-md bg-black border-l border-white/10 sm:rounded-l-2xl z-50 flex flex-col text-white select-none overflow-hidden transform will-change-transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10 bg-black z-10">
          <div className="flex items-center gap-2">
            <h2 id="cart-drawer-title" className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Shopping Bag
            </h2>
            <span className="text-xs text-neutral-400">
              ({itemCount})
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-neutral-400"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-neutral-900 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900/60 border border-white/10 flex items-center justify-center mb-4 text-neutral-500">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                Your Bag is Empty
              </p>
              <p className="text-xs text-neutral-400 max-w-xs mb-6">
                Discover pieces from our latest streetwear drops to start building your look.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white border border-white"
              >
                Shop Products
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
              return (
                <CartDrawerItem
                  key={itemKey}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5 bg-black z-10">
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
              className="w-full py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-red-600"
            >
              Checkout Now
            </button>

            <button
              type="button"
              onClick={handleViewCart}
              className="w-full py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 border border-white/15"
            >
              View Shopping Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
};
