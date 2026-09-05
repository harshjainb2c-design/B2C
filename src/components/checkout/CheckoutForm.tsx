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
      <div className="min-h-screen bg-black py-16 text-center">
        <p className="text-neutral-400 text-sm">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-6 sm:py-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-white">Checkout</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="border border-neutral-800 p-4 sm:p-6 lg:p-8">
              <div className="mb-8 flex items-center">
                <div className={`flex items-center ${step === 'shipping' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center border-2 font-bold ${step === 'shipping' ? 'border-white bg-white text-black' : 'border-neutral-700'}`}>
                    1
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider sm:text-sm">Shipping</span>
                </div>
                <div className="mx-3 h-0.5 flex-1 bg-neutral-800 sm:mx-4" />
                <div className={`flex items-center ${step === 'review' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center border-2 font-bold ${step === 'review' ? 'border-white bg-white text-black' : 'border-neutral-700'}`}>
                    2
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider sm:text-sm">Review</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {step === 'shipping' ? (
                <>
                  <h2 className="mb-6 text-base font-bold uppercase tracking-wider text-white">Shipping information</h2>
                  <ShippingForm onSubmit={handleShippingSubmit} isLoading={isSubmitting} defaultValues={shippingAddress || undefined} />
                </>
              ) : (
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4 border border-neutral-800 p-4">
                    <div>
                      <h2 className="mb-2 text-base font-bold uppercase tracking-wider text-white">Delivery address</h2>
                      <p className="text-sm text-neutral-400">
                        {shippingAddress?.fullName}<br />
                        {shippingAddress?.addressLine1}<br />
                        {shippingAddress?.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                        {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}<br />
                        {shippingAddress?.phone}
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep('shipping')} className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white underline transition-colors">
                      Edit
                    </button>
                  </div>

                  <div className="mb-6 border border-neutral-800 p-4">
                    <div className="flex gap-3">
                      <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-neutral-400" />
                      <div>
                        <h2 className="font-bold text-white">Cash on Delivery</h2>
                        <p className="mt-1 text-sm text-neutral-400">Pay when your Shiprocket delivery arrives.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={isSubmitting}
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-white px-6 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
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
