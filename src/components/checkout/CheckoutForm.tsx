import { useState, useEffect } from 'react';
import { PackageCheck, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { ShippingForm } from './ShippingForm';
import { OrderSummary } from './OrderSummary';
import { apiClient } from '../../lib/api-client';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { CreateOrderRequest, Order, ShippingAddress } from '../../types/order';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CheckoutStep = 'shipping' | 'review';
type PaymentOption = 'online' | 'cod';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(true);
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const total = getTotal();

  useEffect(() => {
    apiClient.get<any>('/payments?action=config')
      .then((cfg) => {
        if (!cfg?.razorpay?.enabled) {
          setIsOnlineAvailable(false);
          setPaymentOption('cod');
        }
      })
      .catch(() => {
        setIsOnlineAvailable(false);
        setPaymentOption('cod');
      });
  }, []);

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setError(null);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;

    if (paymentOption === 'online') {
      await handleRazorpayPayment();
    } else {
      await handleCodOrder();
    }
  };

  const handleCodOrder = async () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to place your COD order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!shippingAddress) return;
    setIsSubmitting(true);
    setError(null);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError('Failed to load secure Razorpay gateway. Please try Cash on Delivery or reload.');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderPayload = {
        items: items.map(({ productId, quantity, size }) => ({ productId, quantity, size })),
        shippingAddress,
      };

      const orderData = await apiClient.post<any>('/payments?action=create_order', orderPayload, { requiresAuth: true });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'B2C Exports & Kicks',
        description: 'Streetwear Archive Drop Order',
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email || '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (response: any) => {
          try {
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: items.map(({ productId, quantity, size }) => ({ productId, quantity, size })),
              shippingAddress,
            };

            const verifyResult = await apiClient.post<any>('/payments?action=verify', verifyPayload, { requiresAuth: true });
            if (verifyResult.success && verifyResult.orderId) {
              clearCart();
              onSuccess(verifyResult.orderId);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (verifyErr) {
            setError(verifyErr instanceof Error ? verifyErr.message : 'Payment recorded but verification failed. Please check your orders.');
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setError(resp.error?.description || 'Payment was unsuccessful. Please try again or choose COD.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to initiate online payment');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black py-16 text-center text-white select-none font-inter">
        <p className="text-neutral-400 text-xs font-inter">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-10 pb-16 sm:pb-24 text-white select-none font-inter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-5 sm:pb-8 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Checkout
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 tracking-wide">
              Secure Delivery & Payment Dispatch
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="bg-neutral-950/50 border border-white/10 rounded-2xl p-5 sm:p-7">
              <div className="mb-6 flex items-center">
                <div className={`flex items-center ${step === 'shipping' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 'shipping' ? 'bg-white text-black' : 'border border-white/15 text-neutral-400'}`}>
                    1
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider">Shipping</span>
                </div>
                <div className="mx-3 h-[1px] flex-1 bg-white/10 sm:mx-4" />
                <div className={`flex items-center ${step === 'review' ? 'text-white' : 'text-neutral-500'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 'review' ? 'bg-white text-black' : 'border border-white/15 text-neutral-400'}`}>
                    2
                  </div>
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider">Payment & Review</span>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-xl bg-red-950/40 border border-red-800/60 p-3.5 text-xs text-red-200">
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
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4 bg-black border border-white/10 rounded-xl p-4">
                    <div>
                      <h2 className="mb-1 text-xs uppercase tracking-wider font-bold text-white">Delivery Address</h2>
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

                  <div>
                    <h2 className="mb-3 text-xs uppercase tracking-wider font-bold text-neutral-400">Select Payment Method</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {isOnlineAvailable && (
                        <div
                          onClick={() => setPaymentOption('online')}
                          className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            paymentOption === 'online'
                              ? 'border-white bg-white/5'
                              : 'border-white/10 bg-black'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-white" />
                              <span className="text-xs font-bold uppercase tracking-wider text-white">UPI / Cards / NetBanking</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                              Instant
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            Pay securely with Google Pay, PhonePe, Paytm, Cards via Razorpay.
                          </p>
                        </div>
                      )}

                      <div
                        onClick={() => setPaymentOption('cod')}
                        className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          paymentOption === 'cod'
                            ? 'border-white bg-white/5'
                            : 'border-white/10 bg-black'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-white" />
                            <span className="text-xs font-bold uppercase tracking-wider text-white">Cash on Delivery</span>
                          </div>
                          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-white/10 px-2 py-0.5 rounded-full">
                            Doorstep
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Pay cash or UPI directly to courier upon physical delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>256-bit encrypted checkout · Dispatched via Shiprocket Express</span>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black disabled:opacity-50 disabled:cursor-not-allowed border border-white"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>
                      {isSubmitting
                        ? (paymentOption === 'online' ? 'Opening Payment Gateway...' : 'Booking Shipment...')
                        : (paymentOption === 'online' ? `Pay Online · ₹${total.toFixed(0)}` : `Place COD Order · ₹${total.toFixed(0)}`)}
                    </span>
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
