import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../lib/currency';

export const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrder(orderId || '');
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart when component mounts
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Success message */}
      <div className="text-center mb-8">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-sm text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      {/* Order details */}
      <div className="border border-gray-200 p-6 mb-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-2">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Date</p>
              <p className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium text-gray-900 capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Total</p>
              <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
          <div className="text-xs text-gray-600">
            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
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

        {/* Order items */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => {
              const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
              return (
                <div key={itemKey} className="flex items-center gap-4">
                  {item.product.images && item.product.images.length > 0 && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    {item.size && (
                      <p className="text-xs text-gray-600">
                        Size: <span className="font-semibold text-warmBrown">{item.size}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link
          to="/orders"
          className="px-6 py-2.5 text-sm font-medium border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          View All Orders
        </Link>
        <Link
          to="/products"
          className="px-6 py-2.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
