import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShippingForm } from './ShippingForm';
import { OrderSummary } from './OrderSummary';
import { ShippingAddress } from '../../types/order';
import { useCartStore } from '../../stores/cartStore';
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from '../../hooks/useRazorpayCheckout';
import { openRazorpayPayment, RazorpaySuccessResponse } from '../../lib/razorpay';
import { createOrderDirect } from '../../lib/orders-client';
import { CreditCard, Loader2 } from 'lucide-react';

interface RazorpayCheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export const RazorpayCheckoutForm = ({ onSuccess }: RazorpayCheckoutFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { items, getTotal, clearCart } = useCartStore();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();

  const total = getTotal();

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!shippingAddress) {
      setError('Please provide shipping address');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order
      const razorpayOrder = await createRazorpayOrder.mutateAsync({
        amount: total,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          customer_name: shippingAddress.fullName,
          customer_phone: shippingAddress.phone,
        },
      });

      // Step 2: Open Razorpay payment modal
      await openRazorpayPayment({
        orderId: razorpayOrder.id,
        amount: total,
        currency: 'INR',
        name: 'B2C Store',
        description: 'Purchase from B2C Fashion Store',
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        notes: {
          address: `${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`,
        },
        theme: {
          color: '#6b5a4d', // Warm brown
        },
        onSuccess: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 3: Verify payment signature
            await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Step 4: Create order in database
            const order = await createOrderDirect({
              items: items,
              shippingAddress,
              paymentIntentId: response.razorpay_payment_id,
            });

            // Step 5: Clear cart and redirect
            clearCart();
            onSuccess(order.id);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
            setIsProcessing(false);
          }
        },
        onFailure: (err: any) => {
          setError(err.description || err.message || 'Payment failed');
          setIsProcessing(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-warmBrown mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'shipping'
                        ? 'bg-terracotta text-white'
                        : 'bg-sand text-warmBrown'
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-warmBrown">Shipping</span>
                </div>
                <div className="flex-1 h-0.5 bg-beige-300 mx-4" />
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'payment'
                        ? 'bg-terracotta text-white'
                        : 'bg-sand text-warmBrown'
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-warmBrown">Payment</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Shipping Form */}
              {step === 'shipping' && (
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                />
              )}

              {/* Payment Step */}
              {step === 'payment' && shippingAddress && (
                <div>
                  <h2 className="text-xl font-bold text-warmBrown mb-4">Payment</h2>
                  
                  {/* Shipping Address Summary */}
                  <div className="mb-6 p-4 bg-sand rounded-lg">
                    <h3 className="text-sm font-semibold text-warmBrown mb-2">Shipping Address</h3>
                    <p className="text-sm text-taupe">
                      {shippingAddress.fullName}<br />
                      {shippingAddress.addressLine1}<br />
                      {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
                      {shippingAddress.country}<br />
                      Phone: {shippingAddress.phone}
                    </p>
                    <button
                      onClick={() => setStep('shipping')}
                      className="mt-2 text-sm text-terracotta hover:underline"
                    >
                      Edit Address
                    </button>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white bg-terracotta hover:bg-warmBrown disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay ₹{total.toFixed(2)} with Razorpay
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-xs text-center text-taupe">
                    Secure payment powered by Razorpay. We accept UPI, Cards, Net Banking, and Wallets.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
};
