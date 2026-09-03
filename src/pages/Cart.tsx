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
      return; // Prevent checkout if stock issues exist
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-beige-300 mb-6" />
              <h1 className="text-2xl font-bold text-warmBrown mb-3">
                Your cart is empty
              </h1>
              <p className="text-sm text-taupe mb-8 max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 text-sm font-semibold text-white bg-terracotta hover:bg-warmBrown uppercase tracking-wider flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-6 border-b border-beige-300">
          <button
            onClick={handleContinueShopping}
            className="flex items-center gap-2 text-warmBrown hover:text-terracotta mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-warmBrown">Shopping Cart</h1>
          <p className="text-sm text-taupe mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Stock Warning */}
        {hasStockIssues && (
          <div className="mb-6 bg-orange-50 border border-orange-200 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-orange-900 mb-1">
                Stock Availability Issues
              </h3>
              <p className="text-xs text-orange-800">
                Some items in your cart have limited stock or are no longer available. 
                Please adjust quantities before proceeding to checkout.
              </p>
              <ul className="mt-2 space-y-1">
                {stockValidation.insufficientStockItems.map((item) => {
                  const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
                  return (
                    <li key={itemKey} className="text-xs text-orange-800">
                      • <strong>{item.product.name}</strong>{item.size && ` (Size: ${item.size})`}: Only {item.product.stock} available 
                      (you have {item.quantity} in cart)
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Cart Content - Mobile: Stack vertically, Desktop: Side-by-side (2/3 + 1/3) */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items - 2/3 width on desktop */}
          <div className="w-full lg:w-2/3">
            <div className="border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-medium text-gray-900 mb-4 sm:mb-6">Cart Items</h2>
              <div className="space-y-4">
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
                        <div className="mt-2 ml-0 sm:ml-28 text-xs text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Only {item.product.stock} available in stock
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cart Summary - 1/3 width on desktop, full width on mobile */}
          <div className="w-full lg:w-1/3">
            <div className="lg:sticky lg:top-8">
              <CartSummary
                total={total}
                itemCount={itemCount}
                onCheckout={handleCheckout}
                showCheckoutButton={!hasStockIssues}
              />
              
              {hasStockIssues && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200">
                  <p className="text-xs text-orange-800 text-center">
                    Please resolve stock issues before checkout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Shopping Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Free Shipping</h4>
              <p>Free standard shipping on orders over ₹2000</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Easy Returns</h4>
              <p>30-day return policy on all items</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Secure Checkout</h4>
              <p>Your payment information is always secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
