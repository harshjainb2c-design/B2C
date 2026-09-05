interface CartSummaryProps {
  total: number;
  itemCount: number;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export const CartSummary = ({
  total,
  itemCount,
  onCheckout,
  showCheckoutButton = true,
}: CartSummaryProps) => {
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
    <div className="bg-black border border-neutral-800 p-6 text-white select-none">
      <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-white font-bold mb-4 pb-3 border-b border-neutral-900">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-neutral-400">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-bold text-white">{formatPrice(total)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-400">Estimated GST (5%)</span>
          <span className="font-bold text-white">{formatPrice(estimatedTax)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-neutral-400">Express Delivery</span>
          <span className="font-bold text-emerald-400">FREE</span>
        </div>

        <div className="border-t border-neutral-800 pt-3 mt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold">
              Total Due
            </span>
            <span className="text-xl font-bold text-white">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <button
          type="button"
          onClick={onCheckout}
          disabled={itemCount === 0}
          className="w-full py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed transition-all"
        >
          Proceed To Checkout
        </button>
      )}

      <p className="text-[11px] font-mono text-neutral-500 text-center mt-4">
        Applicable taxes and delivery calculated at checkout
      </p>
    </div>
  );
};
