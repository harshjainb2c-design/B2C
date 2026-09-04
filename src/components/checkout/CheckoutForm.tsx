import { useState } from 'react';
import { PackageCheck, Truck } from 'lucide-react';
import { ShippingForm } from './ShippingForm';
import { OrderSummary } from './OrderSummary';
import { apiClient } from '../../lib/api-client';
import { useCartStore } from '../../stores/cartStore';
import { CreateOrderRequest, Order, ShippingAddress } from '../../types/order';

type CheckoutStep = 'shipping' | 'review';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setError(null);
    setStep('review');
  };

  const placeOrder = async () => {
    if (!shippingAddress) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const request: CreateOrderRequest = {
        items: items.map(({ productId, quantity, size }) => ({ productId, quantity, size })),
        shippingAddress,
        paymentMethod: 'cod',
      };
      const order = await apiClient.post<Order>('/orders', request, { requiresAuth: true });

      clearCart();
      onSuccess(order.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to place your order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-16 text-center">
        <p className="text-[#8b7355]">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-[#3d3228]">Checkout</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-[#d4c5b0] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="mb-8 flex items-center">
                <div className={`flex items-center ${step === 'shipping' ? 'text-[#3d3228]' : 'text-[#8b7355]'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${step === 'shipping' ? 'border-[#c9a87c] bg-[#8b7355] text-white' : 'border-[#d4c5b0]'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-semibold sm:text-base">Shipping</span>
                </div>
                <div className="mx-3 h-0.5 flex-1 bg-[#d4c5b0] sm:mx-4" />
                <div className={`flex items-center ${step === 'review' ? 'text-[#3d3228]' : 'text-[#8b7355]'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${step === 'review' ? 'border-[#c9a87c] bg-[#8b7355] text-white' : 'border-[#d4c5b0]'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-semibold sm:text-base">Review</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === 'shipping' ? (
                <>
                  <h2 className="mb-6 text-lg font-bold text-[#3d3228]">Shipping information</h2>
                  <ShippingForm onSubmit={handleShippingSubmit} isLoading={isSubmitting} defaultValues={shippingAddress || undefined} />
                </>
              ) : (
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4 rounded-lg bg-[#faf8f5] p-4">
                    <div>
                      <h2 className="mb-2 text-lg font-bold text-[#3d3228]">Delivery address</h2>
                      <p className="text-sm text-[#6b5a4d]">
                        {shippingAddress?.fullName}<br />
                        {shippingAddress?.addressLine1}<br />
                        {shippingAddress?.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}<br />
                        {shippingAddress?.phone}
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep('shipping')} className="text-sm font-medium text-[#8b7355] underline">
                      Edit
                    </button>
                  </div>

                  <div className="mb-6 rounded-lg border border-[#d4c5b0] p-4">
                    <div className="flex gap-3">
                      <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8b7355]" />
                      <div>
                        <h2 className="font-semibold text-[#3d3228]">Cash on Delivery</h2>
                        <p className="mt-1 text-sm text-[#6b5a4d]">Pay when your Shiprocket delivery arrives.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={isSubmitting}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#8b7355] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#6b5a4d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PackageCheck className="h-5 w-5" />
                    {isSubmitting ? 'Creating shipment...' : `Place COD order · ₹${total.toFixed(0)}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <OrderSummary items={items} total={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
