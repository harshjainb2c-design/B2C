import { CartItem } from '../../types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const estimatedTax = Math.round(total * 0.05);
  const estimatedTotal = total + estimatedTax;

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-md p-5 sm:p-6 text-white select-none">
      <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold pb-3.5 mb-4 border-b border-neutral-900">
        Order Summary
      </h2>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto divide-y divide-neutral-900 scrollbar-none">
        {items.map((item) => {
          const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
          return (
            <div key={itemKey} className="pt-3 first:pt-0 flex justify-between items-start gap-3 text-xs">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{item.product.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-neutral-400">
                  {item.size && <span>Size: {item.size}</span>}
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <p className="font-semibold text-white shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-neutral-900 pt-3.5 space-y-2.5 text-xs">
        <div className="flex justify-between items-center text-neutral-400">
          <span>Subtotal</span>
          <span className="font-semibold text-white">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between items-center text-neutral-400">
          <span>Estimated GST (5%)</span>
          <span className="font-semibold text-white">{formatPrice(estimatedTax)}</span>
        </div>
        <div className="flex justify-between items-center text-neutral-400">
          <span>Shipping</span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">Free</span>
        </div>
        <div className="border-t border-neutral-900 pt-3 mt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-neutral-200 font-bold">
              Total
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
