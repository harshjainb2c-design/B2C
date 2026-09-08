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
      <div className="min-h-screen bg-black text-white pt-10 sm:pt-16 pb-16 px-4 select-none flex items-center justify-center font-inter">
        <div className="max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-900/60 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
            YOUR BAG IS EMPTY
          </h1>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            No items added yet. Explore the collection to build your look.
          </p>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white border border-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Collection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-6 sm:pt-10 pb-16 sm:pb-24 select-none font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-5 sm:pb-8 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 tracking-wide">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinueShopping}
            className="text-xs uppercase tracking-wider text-neutral-400"
          >
            Continue Browsing
          </button>
        </div>

        {hasStockIssues && (
          <div className="mb-6 bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase text-red-400 mb-1">
                Stock Adjustment Required
              </h3>
              <p className="text-xs text-neutral-300">
                Some items exceed current stock. Please adjust quantities before checkout.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/3">
            <div className="divide-y divide-neutral-900">
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
                      <div className="py-2 text-xs text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Only {item.product.stock} available</span>
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
