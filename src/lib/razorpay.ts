// Razorpay integration for Indian market
// Documentation: https://razorpay.com/docs/

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Razorpay configuration
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
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

/**
 * Format amount for Razorpay (convert to paise)
 * Razorpay expects amounts in the smallest currency unit (paise for INR)
 * 1 INR = 100 paise
 */
export const formatAmountForRazorpay = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Razorpay (convert from paise to rupees)
 */
export const formatAmountFromRazorpay = (amount: number): number => {
  return amount / 100;
};

/**
 * Format currency for display (INR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface RazorpayOrderOptions {
  amount: number; // Amount in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onFailure: (error: any) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Open Razorpay payment modal
 */
export const openRazorpayPayment = async (
  options: RazorpayPaymentOptions
): Promise<void> => {
  // Load Razorpay script
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  if (!razorpayKeyId) {
    throw new Error('Razorpay key ID is not configured');
  }

  const razorpayOptions = {
    key: razorpayKeyId,
    amount: formatAmountForRazorpay(options.amount),
    currency: options.currency || 'INR',
    name: options.name,
    description: options.description || 'Purchase from B2C Store',
    image: options.image || '/logo.png',
    order_id: options.orderId,
    prefill: options.prefill,
    notes: options.notes,
    theme: {
      color: options.theme?.color || '#6b5a4d', // Warm brown color
    },
    handler: function (response: RazorpaySuccessResponse) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        options.onFailure(new Error('Payment cancelled by user'));
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.on('payment.failed', function (response: any) {
    options.onFailure(response.error);
  });

  razorpay.open();
};

/**
 * Get Razorpay key ID
 */
export const getRazorpayKeyId = (): string | undefined => {
  return razorpayKeyId;
};
