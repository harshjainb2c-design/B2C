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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="text-white font-inter">
      <div className="pb-4 mb-4 border-b border-white/10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h2 className="text-base font-semibold text-white mb-0.5">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-[11px] text-neutral-500">
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })} · {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2.5 font-medium">Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => {
            const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
            return (
              <div
                key={itemKey}
                className="flex gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="flex-shrink-0 w-12 h-14 bg-white/5 rounded overflow-hidden">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[8px]">
                      N/A
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {item.product?.name || 'Product'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.size && (
                      <span className="text-[11px] text-neutral-400">Size: {item.size}</span>
                    )}
                    <span className="text-[11px] text-neutral-400">Qty: {item.quantity}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-white">{formatPrice(item.price * item.quantity)}</p>
                  {item.quantity > 1 && (
                    <p className="text-[11px] text-neutral-500">{formatPrice(item.price)} each</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2.5 font-medium">Shipping Address</h3>
        <div className="bg-white/5 rounded-lg p-3.5 text-sm space-y-0.5">
          <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-neutral-400">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-xs text-neutral-400">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-xs text-neutral-400">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-xs text-neutral-400">{order.shippingAddress.country}</p>
          <p className="text-xs text-white pt-1">Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-3.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-500">Order Total</span>
          <span className="text-lg font-semibold text-white">{formatPrice(order.total)}</span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-1.5">
          Payment: COD · {order.paymentStatus.replace('_', ' ').toUpperCase()}
        </p>
        {order.awbCode && (
          <p className="text-[11px] text-neutral-500 mt-0.5 break-all">
            AWB: <span className="text-white">{order.awbCode}</span>
            {order.courierName ? ` · ${order.courierName}` : ''}
          </p>
        )}
      </div>
    </div>
  );
};
