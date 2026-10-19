import { useState, useEffect } from 'react';
import { X, Truck, ShieldCheck, CheckCircle2, ChevronRight, PackageCheck, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/currency';

interface ShiprocketCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItem?: {
    product: any;
    quantity: number;
    size?: string;
  };
}

export const ShiprocketCheckoutModal = ({ isOpen, onClose, directItem }: ShiprocketCheckoutModalProps) => {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const items = directItem
    ? [{ productId: directItem.product.id, product: directItem.product, quantity: directItem.quantity, price: directItem.product.price, size: directItem.size }]
    : cartItems;

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(false);

  const [isCheckingCourier, setIsCheckingCourier] = useState(false);
  const [courierInfo, setCourierInfo] = useState<{
    checked: boolean;
    serviceable: boolean;
    courierName?: string;
    etd?: string;
  }>({ checked: false, serviceable: true });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (user?.fullName && !fullName) {
      setFullName(user.fullName);
    }
  }, [user, fullName]);

  useEffect(() => {
    apiClient.get<any>('/payments?action=config')
      .then((cfg) => {
        if (cfg?.razorpay?.enabled) {
          setIsOnlineAvailable(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const cleanPin = postalCode.replace(/\D/g, '');
    if (cleanPin.length === 6) {
      setIsCheckingCourier(true);
      apiClient.get<any>(`/shiprocket?action=serviceability&pincode=${cleanPin}&cod=${paymentMethod === 'cod' ? '1' : '0'}`)
        .then((res) => {
          const couriers = res?.data?.available_courier_companies;
          if (Array.isArray(couriers) && couriers.length > 0) {
            const best = couriers[0];
            setCourierInfo({
              checked: true,
              serviceable: true,
              courierName: best.courier_name,
              etd: best.etd || `${best.estimated_delivery_days || 3} days`,
            });
            if (best.city && !city) setCity(best.city);
            if (best.state && !state) setState(best.state);
          } else {
            setCourierInfo({ checked: true, serviceable: false });
          }
        })
        .catch(() => {
          setCourierInfo({ checked: true, serviceable: true });
        })
        .finally(() => setIsCheckingCourier(false));
    } else {
      setCourierInfo({ checked: false, serviceable: true });
    }
  }, [postalCode, paymentMethod]);

  if (!isOpen) return null;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const cleanPin = postalCode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setError('Please enter a valid 6-digit delivery PIN code');
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !state.trim()) {
      setError('Please fill in complete delivery address details');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress = {
        fullName: fullName.trim() || 'Customer',
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: cleanPin,
        country: 'India',
        phone: cleanPhone.slice(-10),
      };

      const payload = {
        items: items.map(({ productId, quantity, size }) => ({ productId, quantity, size })),
        shippingAddress,
        paymentMethod: 'cod',
      };

      const order = await apiClient.post<any>('/orders', payload, { requiresAuth: true });
      clearCart();
      setConfirmedOrder(order);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-inter select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Shiprocket Express Checkout
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 text-center space-y-5 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">Order Confirmed!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Shipment has been scheduled via Shiprocket Logistics.
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Order ID:</span>
                <span className="text-white font-mono">{confirmedOrder.id}</span>
              </div>
              {confirmedOrder.shiprocket_order_id && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Shiprocket Order:</span>
                  <span className="text-emerald-400 font-bold">#{confirmedOrder.shiprocket_order_id}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-400">Payment:</span>
                <span className="text-white uppercase font-bold">{confirmedOrder.payment_method || 'Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between py-1 pt-2">
                <span className="text-neutral-300 font-bold">Total Payable:</span>
                <span className="text-white font-bold">{formatCurrency(confirmedOrder.total || total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/order-confirmation/${confirmedOrder.id}`, { state: { order: confirmedOrder } });
              }}
              className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors"
            >
              View Full Order Tracking
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {items[0]?.product?.images?.[0] && (
                  <img src={items[0].product.images[0]} alt="Item" className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                )}
                <div>
                  <p className="text-xs font-bold text-white line-clamp-1">{items[0]?.product?.name || 'Order Items'}</p>
                  <p className="text-[11px] text-neutral-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'} {items[0]?.size ? `· Size ${items[0].size}` : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-white">{formatCurrency(total)}</p>
                <span className="text-[10px] text-emerald-400 font-medium">Free Shipping</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">1. Contact & Delivery</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                />
              </div>

              <input
                type="text"
                required
                placeholder="House / Flat / Street Address"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
              />

              <div className="grid grid-cols-3 gap-2.5">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="PIN Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-black border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                />
              </div>

              {isCheckingCourier && (
                <div className="flex items-center gap-2 text-neutral-400 text-[11px] animate-pulse">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Checking Shiprocket courier serviceability...</span>
                </div>
              )}

              {courierInfo.checked && (
                <div className="p-2.5 bg-neutral-900/60 border border-white/10 rounded-lg flex items-center gap-2 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {courierInfo.serviceable ? (
                    <span className="text-neutral-200">
                      Serviceable via <strong className="text-white">{courierInfo.courierName || 'Shiprocket'}</strong> {courierInfo.etd ? `· Est. Delivery: ${courierInfo.etd}` : ''}
                    </span>
                  ) : (
                    <span className="text-amber-400">Standard postal delivery available</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">2. Payment Option</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cod' ? 'border-white bg-white/10 text-white' : 'border-white/10 bg-black text-neutral-400'
                  }`}
                >
                  <p className="text-xs font-bold text-white uppercase">Cash on Delivery</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Pay at doorstep</p>
                </button>

                {isOnlineAvailable ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'online' ? 'border-white bg-white/10 text-white' : 'border-white/10 bg-black text-neutral-400'
                    }`}
                  >
                    <p className="text-xs font-bold text-white uppercase">UPI / Cards</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">Instant confirmation</p>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl border border-white/5 bg-neutral-950 text-neutral-600 cursor-not-allowed">
                    <p className="text-xs font-bold uppercase">Online Payment</p>
                    <p className="text-[10px] mt-0.5">Currently COD only</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PackageCheck className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Booking Shipment...' : `Place COD Order · ${formatCurrency(total)}`}
                </span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Shiprocket Logistics Verified · 100% Secure Checkout</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
