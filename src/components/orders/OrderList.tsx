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
      <div className="bg-black border border-neutral-800 p-8 sm:p-12 text-center text-white select-none">
        <p className="text-base font-mono uppercase text-white font-bold mb-2">No Orders Found</p>
        <p className="text-xs font-mono text-neutral-400">
          Your orders will appear here once you place a purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 select-none">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderClick?.(order.id)}
          className="border border-neutral-800 bg-black p-4 sm:p-6 hover:border-neutral-600 transition-all cursor-pointer touch-manipulation text-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-sm sm:text-base font-mono font-bold uppercase text-white">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <OrderStatus status={order.status} />
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
              <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
              <div>
                <p className="text-base sm:text-lg font-mono font-bold text-white">
                  {formatPrice(order.total)}
                </p>
                <p className="text-[11px] font-mono text-neutral-400">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {order.items.map((item, index) => {
                const itemKey = item.size ? `${item.productId}-${item.size}-${index}` : `${item.productId}-${index}`;
                return (
                  <div
                    key={itemKey}
                    className="flex-shrink-0 w-12 h-14 bg-neutral-950 border border-neutral-800 overflow-hidden"
                  >
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[8px] font-mono">
                        N/A
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
