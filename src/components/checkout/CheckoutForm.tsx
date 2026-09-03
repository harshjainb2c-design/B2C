import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { ShippingForm } from './ShippingForm';
import { PaymentForm } from './PaymentForm';
import { OrderSummary } from './OrderSummary';
import { ShippingAddressInput } from '../../lib/validation';
import { useCartStore } from '../../stores/cartStore';
import { useCheckout } from '../../hooks/useCheckout';
import { getStripe } from '../../lib/stripe';
import { createOrderDirect } from '../../lib/orders-client';

type CheckoutStep = 'shipping' | 'payment';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

const CheckoutFormContent = ({ onSuccess }: CheckoutFormProps) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressInput | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotal, clearCart } = useCartStore();
  const { createPaymentIntent, createOrder } = useCheckout();

  const total = getTotal();

  const handleShippingSubmit = async (data: ShippingAddressInput) => {
    setShippingAddress(data);
    setError(null);
    setStep('payment');
  };

  const handleCODOrder = async () => {
    if (!shippingAddress) return;

    setError(null);

    try {
      // Create order directly in Supabase (bypassing API)
      const order = await createOrderDirect({
        items: items.map((item) => ({
          productId: item.productId,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentIntentId: 'cod_' + Date.now(), // Generate a COD reference ID
      });

      // Clear cart and redirect to confirmation
      clearCart();
      onSuccess(order.id);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'cod') {
      return handleCODOrder();
    }

    if (!stripe || !elements || !shippingAddress || !paymentIntentId) {
      return;
    }

    setError(null);

    try {
      // Create payment intent first
      const result = await createPaymentIntent.mutateAsync({
        amount: total,
        currency: 'usd',
      });

      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create order in database
        const order = await createOrder.mutateAsync({
          items: items.map((item) => ({
            productId: item.productId,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          paymentIntentId: result.paymentIntentId,
        });

        // Clear cart and redirect to confirmation
        clearCart();
        onSuccess(order.id);
      } else {
        setError('Payment was not successful. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-[#faf8f5] min-h-screen">
        <p className="text-[#8b7355]">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-[#faf8f5] min-h-screen">
      <h1 className="text-3xl font-bold text-[#3d3228] mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Mobile: Single column, Desktop: Two-column (form left, summary right) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form Section - Left side on desktop, full width on mobile */}
        <div className="w-full lg:w-2/3">
          {/* Step indicator */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center">
              <div className={`flex items-center ${step === 'shipping' ? 'text-[#3d3228]' : 'text-[#8b7355]'}`}>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border-2 rounded-full font-bold ${
                  step === 'shipping' ? 'border-[#c9a87c] bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] text-white' : 'border-[#d4c5b0] text-[#8b7355]'
                } touch-manipulation`}>
                  1
                </div>
                <span className="ml-2 text-sm sm:text-base font-semibold">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 sm:mx-4 bg-[#d4c5b0]"></div>
              <div className={`flex items-center ${step === 'payment' ? 'text-[#3d3228]' : 'text-[#8b7355]'}`}>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border-2 rounded-full font-bold ${
                  step === 'payment' ? 'border-[#c9a87c] bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] text-white' : 'border-[#d4c5b0] text-[#8b7355]'
                } touch-manipulation`}>
                  2
                </div>
                <span className="ml-2 text-sm sm:text-base font-semibold">Payment</span>
              </div>
            </div>
          </div>

          {/* Forms */}
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-sm border border-[#d4c5b0] p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg font-bold text-[#3d3228] mb-6">Shipping Information</h2>
              <ShippingForm
                onSubmit={handleShippingSubmit}
                isLoading={createPaymentIntent.isPending}
                defaultValues={shippingAddress || undefined}
              />
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-sm border border-[#d4c5b0] p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg font-bold text-[#3d3228] mb-6">Payment Method</h2>
              <button
                onClick={() => setStep('shipping')}
                className="mb-6 min-h-[44px] flex items-center text-sm text-[#6b5a4d] hover:text-[#c9a87c] font-medium"
              >
                ← Back to Shipping
              </button>

              {/* Payment Method Selection */}
              <div className="mb-6 space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-[#c9a87c] bg-[#faf8f5]' : 'border-[#d4c5b0] hover:border-[#c9a87c]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-[#c9a87c] focus:ring-[#c9a87c]"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-semibold text-[#3d3228]">Cash on Delivery</div>
                    <div className="text-xs text-[#8b7355]">Pay when you receive your order</div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-[#c9a87c] bg-[#faf8f5]' : 'border-[#d4c5b0] hover:border-[#c9a87c]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 text-[#c9a87c] focus:ring-[#c9a87c]"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-semibold text-[#3d3228]">Credit/Debit Card</div>
                    <div className="text-xs text-[#8b7355]">Pay securely with your card</div>
                  </div>
                </label>
              </div>

              {/* Show payment form only for card payment */}
              {paymentMethod === 'card' && clientSecret ? (
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  isLoading={createOrder.isPending}
                />
              ) : paymentMethod === 'cod' ? (
                <button
                  onClick={handlePaymentSubmit}
                  disabled={createOrder.isPending}
                  className="w-full px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#8b7355] to-[#6b5a4d] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider min-h-[44px]"
                >
                  {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Order Summary - Right side on desktop, full width on mobile */}
        <div className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-8">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutForm = (props: CheckoutFormProps) => {
  const [stripePromise] = useState(() => getStripe());
  const { items } = useCartStore();
  const total = useCartStore((state) => state.getTotal());

  // Don't render Stripe Elements if cart is empty
  if (items.length === 0) {
    return <CheckoutFormContent {...props} />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutFormContent {...props} />
    </Elements>
  );
};
