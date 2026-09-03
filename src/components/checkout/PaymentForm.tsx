import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
}

export const PaymentForm = ({ onSubmit, isLoading }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Validate payment element
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment validation failed');
        setIsProcessing(false);
        return;
      }

      // Call parent onSubmit to handle order creation
      await onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Details
        </label>
        <div className="p-4 border border-gray-300 rounded-md">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading || isProcessing}
        className="w-full px-4 py-3 md:py-3.5 text-sm md:text-base font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
      >
        {isProcessing || isLoading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};
