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
    <div className="bg-neutral-950/50 border border-white/10 rounded-2xl p-5 sm:p-6 text-white select-none font-inter">
      <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold pb-3.5 mb-4 border-b border-white/10">
        Order Summary
      </h2>

      <div className="space-y-3.5 mb-5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-neutral-400">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-white">{formatPrice(total)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Estimated GST (5%)</span>
          <span className="font-semibold text-white">{formatPrice(estimatedTax)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-neutral-400">Shipping</span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">Free</span>
        </div>

        <div className="border-t border-white/10 pt-3.5 mt-3.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-neutral-200 font-bold">
              Total
            </span>
            <span className="text-xl font-bold text-white tracking-tight">
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
          className="w-full py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white disabled:opacity-40 disabled:cursor-not-allowed border border-white"
        >
          Proceed To Checkout
        </button>
      )}

      <p className="text-[11px] text-neutral-500 text-center mt-3.5 tracking-wide">
        Taxes and delivery calculated at checkout
      </p>
    </div>
  );
};
