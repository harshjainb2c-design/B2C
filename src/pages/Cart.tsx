import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, removeItem, updateQuantity, validateStock } = useCart();

  const stockValidation = validateStock();
  const hasStockIssues = !stockValidation.isValid;

  const handleCheckout = () => {
    if (hasStockIssues) {
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white py-16 px-4 select-none flex items-center justify-center">
        <div className="max-w-md w-full border border-neutral-800 p-8 sm:p-12 text-center bg-black">
          <ShoppingCart className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
            Your Bag Is Empty
          </h1>
          <p className="text-xs font-mono text-neutral-400 mb-6 leading-relaxed">
            No archive pieces added yet. Explore the fresh drop to build your look.
          </p>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Collection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              B2C Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
              Shopping Bag ({itemCount})
            </h1>
          </div>

          <button
            type="button"
            onClick={handleContinueShopping}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing</span>
          </button>
        </div>

        {hasStockIssues && (
          <div className="mb-6 bg-red-950/20 border border-red-900/60 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-red-400 mb-1">
                Stock Adjustment Required
              </h3>
              <p className="text-xs text-neutral-300 font-mono">
                Some items exceed current physical warehouse stock. Please adjust quantities before checkout.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/3">
            <div className="border border-neutral-800 bg-black p-4 sm:p-6 divide-y divide-neutral-800">
              {items.map((item) => {
                const hasStockIssue = item.product.stock < item.quantity;
                const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
                return (
                  <div key={itemKey}>
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                    {hasStockIssue && (
                      <div className="py-2 text-xs font-mono text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Only {item.product.stock} available in warehouse</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <CartSummary
                total={total}
                itemCount={itemCount}
                onCheckout={handleCheckout}
                showCheckoutButton={!hasStockIssues}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
