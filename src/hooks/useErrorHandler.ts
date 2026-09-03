import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ErrorCode, isAPIException, getErrorMessage } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for handling errors with toast notifications
 * Provides consistent error handling across the application
 */
export function useErrorHandler() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleError = useCallback(
    (error: unknown, options?: { title?: string }) => {
      const { title = 'Error' } = options || {};

      // Handle session expiration
      if (isAPIException(error) && error.code === ErrorCode.UNAUTHORIZED) {
        toast({
          variant: 'destructive',
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { state: { from: window.location.pathname } });
        }, 2000);
        return;
      }

      // Handle forbidden access
      if (isAPIException(error) && error.code === ErrorCode.FORBIDDEN) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
        });
        return;
      }

      // Handle network errors with retry option
      if (isAPIException(error) && error.code === ErrorCode.NETWORK_ERROR) {
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Please check your internet connection.',
        });
        return;
      }

      // Handle validation errors
      if (isAPIException(error) && error.code === ErrorCode.VALIDATION_ERROR) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: error.message || 'Please check your input and try again.',
        });
        return;
      }

      // Handle business logic errors
      if (isAPIException(error)) {
        const userFriendlyMessages: Record<ErrorCode, string> = {
          [ErrorCode.INSUFFICIENT_STOCK]: 'This item is out of stock or has limited availability.',
          [ErrorCode.PAYMENT_FAILED]: 'Payment processing failed. Please try again.',
          [ErrorCode.ORDER_ALREADY_PROCESSED]: 'This order has already been processed.',
          [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
          [ErrorCode.ALREADY_EXISTS]: 'This resource already exists.',
          [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password.',
          [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
          [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again.',
          [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service error occurred. Please try again.',
          [ErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred.',
          [ErrorCode.UNAUTHORIZED]: 'Authentication required.',
          [ErrorCode.FORBIDDEN]: 'Access denied.',
          [ErrorCode.VALIDATION_ERROR]: 'Validation error.',
          [ErrorCode.NETWORK_ERROR]: 'Network error.',
        };

        const description = userFriendlyMessages[error.code] || error.message;

        toast({
          variant: 'destructive',
          title,
          description,
        });
        return;
      }

      // Handle generic errors
      const message = getErrorMessage(error);
      toast({
        variant: 'destructive',
        title,
        description: message,
      });
    },
    [toast, navigate]
  );

  return { handleError };
}
