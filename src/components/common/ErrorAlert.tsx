import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, XCircle } from 'lucide-react';
import { APIException, ErrorCode } from '@/lib/api-client';

interface ErrorAlertProps {
  error: Error | APIException | unknown;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorAlert component for displaying user-friendly error messages
 * Uses shadcn/ui Alert component with appropriate styling
 */
export function ErrorAlert({
  error,
  title = 'Error',
  onRetry,
  onDismiss,
  className,
}: ErrorAlertProps) {
  const getErrorMessage = (): string => {
    if (error instanceof APIException) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  };

  const getErrorDetails = (): string | undefined => {
    if (error instanceof APIException) {
      // Provide user-friendly messages based on error codes
      switch (error.code) {
        case ErrorCode.NETWORK_ERROR:
          return 'Please check your internet connection and try again.';
        case ErrorCode.UNAUTHORIZED:
          return 'Please log in to continue.';
        case ErrorCode.FORBIDDEN:
          return 'You do not have permission to perform this action.';
        case ErrorCode.NOT_FOUND:
          return 'The requested resource was not found.';
        case ErrorCode.VALIDATION_ERROR:
          return 'Please check your input and try again.';
        case ErrorCode.INSUFFICIENT_STOCK:
          return 'This item is currently out of stock or has limited availability.';
        case ErrorCode.PAYMENT_FAILED:
          return 'Payment processing failed. Please check your payment details and try again.';
        default:
          return undefined;
      }
    }

    return undefined;
  };

  const errorMessage = getErrorMessage();
  const errorDetails = getErrorDetails();

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {title}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto hover:opacity-70 transition-opacity"
            aria-label="Dismiss error"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </AlertTitle>
      <AlertDescription>
        <p>{errorMessage}</p>
        {errorDetails && <p className="mt-2 text-sm">{errorDetails}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-destructive-foreground text-destructive rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
