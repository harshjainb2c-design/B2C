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

  const estimatedTax = total * 0.08; // 8% tax estimate
  const estimatedTotal = total + estimatedTax;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#d4c5b0] p-6">
      <h2 className="text-lg font-bold text-[#3d3228] mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#8b7355]">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-[#3d3228]">{formatPrice(total)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#8b7355]">Estimated Tax</span>
          <span className="font-semibold text-[#3d3228]">{formatPrice(estimatedTax)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#8b7355]">Shipping</span>
          <span className="font-semibold text-[#3d3228]">Calculated at checkout</span>
        </div>

        <div className="border-t border-[#d4c5b0] pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-bold text-[#3d3228]">
              Estimated Total
            </span>
            <span className="text-xl font-bold text-[#3d3228]">
              {formatPrice(estimatedTotal)}
            </span>
          </div>
        </div>
      </div>

      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={itemCount === 0}
          className="w-full px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] disabled:opacity-50 disabled:cursor-not-allowed disabled:from-[#d4c5b0] disabled:to-[#d4c5b0] uppercase tracking-wider"
        >
          Proceed to Checkout
        </button>
      )}

      <p className="text-xs text-[#8b7355] text-center mt-4">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
};
