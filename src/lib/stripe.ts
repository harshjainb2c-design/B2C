import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Singleton instance of Stripe
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance
 * This function ensures we only load Stripe once
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }

  return stripePromise || Promise.resolve(null);
};

/**
 * Format amount for Stripe (convert to cents)
 * Stripe expects amounts in the smallest currency unit (cents for USD)
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from Stripe (convert from cents to dollars)
 */
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

/**
 * Format currency for display
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
