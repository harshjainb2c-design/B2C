import { Order } from '../../types/order';
import { OrderStatus } from './OrderStatus';
import { formatDistanceToNow } from 'date-fns';

interface OrderDetailProps {
  order: Order;
}

export const OrderDetail = ({ order }: OrderDetailProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-black text-white select-none">
      <div className="border-b border-neutral-800 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-white mb-1">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
            </p>
            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-semibold">
          Garments & Footwear
        </h3>
        <div className="space-y-3">
          {order.items.map((item) => {
            const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
            return (
              <div
                key={itemKey}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 bg-neutral-950 border border-neutral-800"
              >
                <div className="flex-shrink-0 w-16 h-20 bg-black border border-neutral-800 overflow-hidden">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[9px] font-mono">
                      NO IMAGE
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white mb-1 truncate">
                    {item.product?.name || 'Streetwear Piece'}
                  </h4>
                  {item.size && (
                    <p className="text-xs font-mono text-neutral-400 mb-1">
                      Size: <span className="text-white font-bold">{item.size}</span>
                    </p>
                  )}
                  <p className="text-xs font-mono text-neutral-400">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-xs font-mono text-neutral-400">
                    Price: {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex-shrink-0 text-right ml-auto sm:ml-0">
                  <p className="text-base font-mono font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 font-semibold">
          Shipping Coordinates
        </h3>
        <div className="bg-neutral-950 border border-neutral-800 p-4 text-xs font-mono space-y-1">
          <p className="text-sm font-semibold text-white font-sans">{order.shippingAddress.fullName}</p>
          <p className="text-neutral-400">
            {order.shippingAddress.addressLine1}
          </p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-neutral-400">
              {order.shippingAddress.addressLine2}
            </p>
          )}
          <p className="text-neutral-400">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-neutral-400">{order.shippingAddress.country}</p>
          <p className="text-white font-bold pt-1">
            Phone: {order.shippingAddress.phone}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Order Total
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-white">
            {formatPrice(order.total)}
          </span>
        </div>
        <p className="text-xs font-mono text-neutral-400 mt-2">
          Payment: Cash on Delivery · {order.paymentStatus.replace('_', ' ').toUpperCase()}
        </p>
        {order.awbCode && (
          <p className="text-xs font-mono text-neutral-400 mt-1 break-all">
            Courier AWB: <span className="text-white font-bold">{order.awbCode}</span>
            {order.courierName ? ` · ${order.courierName}` : ''}
          </p>
        )}
      </div>
    </div>
  );
};
