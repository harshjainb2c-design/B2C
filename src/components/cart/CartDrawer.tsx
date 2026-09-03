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

  // Prevent body scroll when drawer is open
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

  // Close on escape key
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-[#faf8f5] shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d4c5b0] bg-white">
          <h2 id="cart-drawer-title" className="text-xl font-bold text-[#3d3228] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#c9a87c]" />
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5f1eb] rounded-md text-[#6b5a4d]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-[#d4c5b0] mb-4" />
              <h3 className="text-lg font-bold text-[#3d3228] mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-[#8b7355] mb-6">
                Add items to your cart to get started
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] uppercase tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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

        {/* Footer with Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#d4c5b0] p-6 space-y-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-[#6b5a4d]">Subtotal</span>
              <span className="text-xl font-bold text-[#3d3228]">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] uppercase tracking-wider"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleViewCart}
              className="w-full px-6 py-3 text-sm font-semibold text-[#6b5a4d] bg-white border-2 border-[#6b5a4d] hover:bg-[#f5f1eb] uppercase tracking-wider"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};
