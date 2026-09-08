import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, AlertTriangle, KeyRound, Truck, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showShiprocketPassword, setShowShiprocketPassword] = useState(false);
  const [showShiprocketWebhook, setShowShiprocketWebhook] = useState(false);

  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);

  const [shiprocketEmail, setShiprocketEmail] = useState('');
  const [shiprocketPassword, setShiprocketPassword] = useState('');
  const [shiprocketPickupLocation, setShiprocketPickupLocation] = useState('Primary');
  const [shiprocketWebhookSecret, setShiprocketWebhookSecret] = useState('');
  const [shiprocketEnabled, setShiprocketEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await apiClient.get<any>('/admin?resource=settings', { requiresAuth: true });
      if (data?.razorpay) {
        setRazorpayKeyId(data.razorpay.keyId || '');
        setRazorpayKeySecret(data.razorpay.keySecret || '');
        setRazorpayEnabled(Boolean(data.razorpay.enabled));
      }
      if (data?.shiprocket) {
        setShiprocketEmail(data.shiprocket.email || '');
        setShiprocketPassword(data.shiprocket.password || '');
        setShiprocketPickupLocation(data.shiprocket.pickupLocation || 'Primary');
        setShiprocketWebhookSecret(data.shiprocket.webhookSecret || '');
        setShiprocketEnabled(Boolean(data.shiprocket.enabled));
      }
    } catch (err) {
      setStatusMessage({ type: 'error', message: 'Failed to load settings. Ensure you are signed in as an admin.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        razorpay: {
          keyId: razorpayKeyId.trim(),
          keySecret: razorpayKeySecret.trim(),
          enabled: razorpayEnabled,
        },
        shiprocket: {
          email: shiprocketEmail.trim(),
          password: shiprocketPassword.trim(),
          pickupLocation: shiprocketPickupLocation.trim() || 'Primary',
          webhookSecret: shiprocketWebhookSecret.trim(),
          enabled: shiprocketEnabled,
        },
      };

      await apiClient.post('/admin?resource=settings', payload, { requiresAuth: true });
      setStatusMessage({ type: 'success', message: 'Integration keys saved successfully. Changes are live immediately.' });
      await fetchSettings();
    } catch (err) {
      setStatusMessage({ type: 'error', message: err instanceof Error ? err.message : 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-inter select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-400 bg-neutral-900 active:bg-neutral-800"
              aria-label="Back to Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                ADMINISTRATION
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                Integrations & API Settings
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white disabled:opacity-50 active:bg-neutral-200 transition-colors border border-white"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl flex items-start gap-3 text-xs bg-neutral-950 border border-white/20 text-white">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                    Razorpay Payment Gateway
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Powers instant UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards & NetBanking
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-neutral-400">
                  {razorpayEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={razorpayEnabled}
                  onChange={(e) => setRazorpayEnabled(e.target.checked)}
                  className="w-4 h-4 accent-white rounded-sm cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Razorpay Key ID *
                </label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_test_... or rzp_live_..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
                {razorpayKeyId.startsWith('rzp_test_') && (
                  <span className="inline-block mt-1 text-[10px] text-neutral-400 font-semibold uppercase">
                    Test Mode Active
                  </span>
                )}
                {razorpayKeyId.startsWith('rzp_live_') && (
                  <span className="inline-block mt-1 text-[10px] text-white font-semibold uppercase">
                    Live Mode Active
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Razorpay Key Secret *
                </label>
                <div className="relative">
                  <input
                    type={showRazorpaySecret ? 'text' : 'password'}
                    value={razorpayKeySecret}
                    onChange={(e) => setRazorpayKeySecret(e.target.value)}
                    placeholder="Enter Secret or leave unchanged"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 active:text-white"
                  >
                    {showRazorpaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                    Shiprocket Logistics (Prepaid + COD)
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Automated shipping orders, AWB assignment & pickup generation
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-neutral-400">
                  {shiprocketEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={shiprocketEnabled}
                  onChange={(e) => setShiprocketEnabled(e.target.checked)}
                  className="w-4 h-4 accent-white rounded-sm cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Shiprocket Account Email *
                </label>
                <input
                  type="email"
                  value={shiprocketEmail}
                  onChange={(e) => setShiprocketEmail(e.target.value)}
                  placeholder="logistics@yourstore.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Shiprocket Password *
                </label>
                <div className="relative">
                  <input
                    type={showShiprocketPassword ? 'text' : 'password'}
                    value={shiprocketPassword}
                    onChange={(e) => setShiprocketPassword(e.target.value)}
                    placeholder="Enter password or leave unchanged"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowShiprocketPassword(!showShiprocketPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 active:text-white"
                  >
                    {showShiprocketPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Pickup Location Name *
                </label>
                <input
                  type="text"
                  value={shiprocketPickupLocation}
                  onChange={(e) => setShiprocketPickupLocation(e.target.value)}
                  placeholder="e.g. Primary, Warehouse-1"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Webhook Secret (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showShiprocketWebhook ? 'text' : 'password'}
                    value={shiprocketWebhookSecret}
                    onChange={(e) => setShiprocketWebhookSecret(e.target.value)}
                    placeholder="Secret for tracking status callbacks"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black border border-white/15 text-white text-xs font-inter placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowShiprocketWebhook(!showShiprocketWebhook)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 active:text-white"
                  >
                    {showShiprocketWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-white disabled:opacity-50 active:bg-neutral-200 transition-colors border border-white"
            >
              {isSaving ? 'Saving Changes...' : 'Save Integration Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
