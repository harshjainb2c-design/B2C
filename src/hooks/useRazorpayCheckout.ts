import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { formatAmountForRazorpay } from '../lib/razorpay';

export interface CreateRazorpayOrderData {
  amount: number; // Amount in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Hook for creating a Razorpay order
 */
export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: async (data: CreateRazorpayOrderData): Promise<RazorpayOrderResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({
          amount: formatAmountForRazorpay(data.amount),
          currency: data.currency || 'INR',
          receipt: data.receipt || `receipt_${Date.now()}`,
          notes: data.notes || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create Razorpay order. Please try again.');
      }

      const result = await response.json();
      return result;
    },
  });
};

/**
 * Hook for verifying Razorpay payment
 */
export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }): Promise<{ verified: boolean }> => {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Payment verification failed. Please contact support.');
      }

      const result = await response.json();
      
      if (!result.verified) {
        throw new Error('Payment signature verification failed. Transaction may be fraudulent.');
      }
      
      return result;
    },
  });
};
