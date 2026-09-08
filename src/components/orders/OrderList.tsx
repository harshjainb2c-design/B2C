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

  if (orders.length === 0) {
    return (
      <div className="border border-white/10 rounded-lg p-8 text-center font-inter">
        <p className="text-sm font-medium text-white mb-1">No Orders Found</p>
        <p className="text-xs text-neutral-500">Your orders will appear here once you place a purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 font-inter">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderClick?.(order.id)}
          className="border border-white/10 rounded-lg p-4 cursor-pointer active:bg-white/5 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-white">
                  #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <OrderStatus status={order.status} />
              </div>
              <p className="text-[11px] text-neutral-500">
                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{formatPrice(order.total)}</p>
                <p className="text-[11px] text-neutral-500">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {order.items.map((item, index) => {
              const itemKey = item.size ? `${item.productId}-${item.size}-${index}` : `${item.productId}-${index}`;
              return (
                <div
                  key={itemKey}
                  className="flex-shrink-0 w-10 h-12 bg-white/5 rounded overflow-hidden"
                >
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[7px]">
                      N/A
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
