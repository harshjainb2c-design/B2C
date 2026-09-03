import { Order } from '../../types/order';
import { OrderStatus } from './OrderStatus';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onOrderClick?: (orderId: string) => void;
}

export const OrderList = ({ orders, onOrderClick }: OrderListProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg mb-2">No orders yet</p>
        <p className="text-gray-500 text-sm">
          Your order history will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderClick?.(order.id)}
          className="border border-gray-200 p-4 sm:p-6 hover:border-gray-300 active:border-gray-400 transition-all cursor-pointer touch-manipulation min-h-[44px]"
        >
          {/* Mobile: Compact card layout */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <OrderStatus status={order.status} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <ChevronRight className="hidden sm:block w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>

          {/* Order Items Summary */}
          <div className="border-t border-gray-200 pt-3 sm:pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm text-gray-600">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {formatPrice(order.total)}
              </p>
            </div>

            {/* Show first few items - Scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {order.items.slice(0, 4).map((item) => {
                const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
                return (
                  <div
                    key={itemKey}
                    className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-md overflow-hidden"
                  >
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                );
              })}
              {order.items.length > 4 && (
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    +{order.items.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
