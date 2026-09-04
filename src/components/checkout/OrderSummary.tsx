import { CartItem } from '../../types/cart';
import { formatCurrency } from '../../lib/currency';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => {
          const itemKey = item.size ? `${item.productId}-${item.size}` : item.productId;
          return (
            <div key={itemKey} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                {item.size && (
                  <p className="text-xs text-gray-600">
                    Size: <span className="font-semibold text-warmBrown">{item.size}</span>
                  </p>
                )}
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-gray-900">{formatCurrency(total)}</p>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <p className="text-gray-600">Shipping</p>
          <p className="text-gray-900">Calculated at next step</p>
        </div>
        <div className="flex justify-between text-base font-semibold mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-900">Total</p>
          <p className="text-gray-900">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>* Final total will be calculated after shipping</p>
      </div>
    </div>
  );
};
