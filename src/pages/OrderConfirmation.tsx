import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../lib/currency';

export const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrder(orderId || '');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto" />
          <p className="mt-4 text-xs font-mono uppercase tracking-wider text-neutral-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white mb-2">Order Not Found</h1>
          <p className="text-sm text-neutral-400 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">Order Confirmed!</h1>
          <p className="text-sm text-neutral-400">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="border border-neutral-800 p-6 mb-6">
          <div className="border-b border-neutral-800 pb-4 mb-4">
            <h2 className="text-base font-bold uppercase tracking-wider text-white mb-3">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Order Number</p>
                <p className="font-semibold text-white">{order.id}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Order Date</p>
                <p className="font-semibold text-white">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Status</p>
                <p className="font-semibold text-white capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Total</p>
                <p className="font-semibold text-white">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-neutral-800 pb-4 mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-semibold">Shipping Address</h3>
            <div className="text-xs text-neutral-400">
              <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4 font-semibold">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => {
                const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
                return (
                  <div key={itemKey} className="flex items-center gap-4">
                    {item.product.images && item.product.images.length > 0 && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover border border-neutral-800"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.product.name}</p>
                      {item.size && (
                        <p className="text-xs text-neutral-400">
                          Size: <span className="font-semibold text-white">{item.size}</span>
                        </p>
                      )}
                      <p className="text-sm text-neutral-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest border border-neutral-700 text-white hover:border-white transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
