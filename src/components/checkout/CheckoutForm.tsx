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
      <div className="min-h-screen bg-black py-16 text-center text-white select-none">
        <p className="text-neutral-400 text-xs">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-10 pb-16 sm:pb-24 text-white select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-5 sm:pb-8 mb-8 sm:mb-12">
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
              Checkout
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 tracking-wide">
              Secure Delivery & Order Verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="bg-neutral-950 border border-neutral-900 rounded-md p-5 sm:p-6">
              <div className="mb-6 flex items-center">
                <div className={`flex items-center ${step === 'shipping' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs font-bold ${step === 'shipping' ? 'bg-white text-black' : 'border border-neutral-800 text-neutral-400'}`}>
                    1
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider">Shipping</span>
                </div>
                <div className="mx-3 h-[1px] flex-1 bg-neutral-900 sm:mx-4" />
                <div className={`flex items-center ${step === 'review' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs font-bold ${step === 'review' ? 'bg-white text-black' : 'border border-neutral-800 text-neutral-400'}`}>
                    2
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider">Review</span>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-md bg-red-600 p-3 text-xs font-medium text-white">
                  {error}
                </div>
              )}

              {step === 'shipping' ? (
                <>
                  <h2 className="mb-4 text-xs uppercase tracking-[0.2em] font-bold text-neutral-400">
                    Shipping Details
                  </h2>
                  <ShippingForm onSubmit={handleShippingSubmit} isLoading={isSubmitting} defaultValues={shippingAddress || undefined} />
                </>
              ) : (
                <div>
                  <div className="mb-4 flex items-start justify-between gap-4 bg-black border border-neutral-900 rounded-sm p-4">
                    <div>
                      <h2 className="mb-2 text-xs uppercase tracking-wider font-bold text-white">Delivery Address</h2>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        <span className="text-white font-medium">{shippingAddress?.fullName}</span><br />
                        {shippingAddress?.addressLine1}<br />
                        {shippingAddress?.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}<br />
                        {shippingAddress?.phone}
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep('shipping')} className="text-xs font-bold uppercase tracking-wider text-neutral-400 underline">
                      Edit
                    </button>
                  </div>

                  <div className="mb-5 bg-black border border-neutral-900 rounded-sm p-4">
                    <div className="flex gap-3 items-center">
                      <Truck className="h-4 w-4 shrink-0 text-neutral-400" />
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-white">Cash on Delivery</h2>
                        <p className="text-xs text-neutral-400 mt-0.5">Pay when your delivery arrives.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={isSubmitting}
                    className="flex min-h-11 w-full items-center justify-center gap-2 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>{isSubmitting ? 'Creating shipment...' : `Place COD order · ₹${total.toFixed(0)}`}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <OrderSummary items={items} total={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
