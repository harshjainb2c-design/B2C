import { CartItem } from '../../types/cart';
import { formatCurrency } from '../../lib/currency';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  return (
    <div className="border border-neutral-800 p-6">
      <h2 className="text-base font-bold uppercase tracking-wider text-white mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => {
          const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
          return (
            <div key={itemKey} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-semibold text-white">{item.product.name}</p>
                {item.size && (
                  <p className="text-xs text-neutral-500">
                    Size: <span className="font-semibold text-white">{item.size}</span>
                  </p>
                )}
                <p className="text-neutral-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-white">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-neutral-800 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <p className="text-neutral-400">Subtotal</p>
          <p className="text-white">{formatCurrency(total)}</p>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <p className="text-neutral-400">Shipping</p>
          <p className="text-white">Calculated at next step</p>
        </div>
        <div className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-neutral-800">
          <p className="text-white">Total</p>
          <p className="text-white">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-neutral-600">
        <p>* Final total will be calculated after shipping</p>
      </div>
    </div>
  );
};
