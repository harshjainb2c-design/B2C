import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { isAPIException, ErrorCode } from '@/lib/api-client';

interface RetryableQueryProps {
  error: unknown;
  onRetry: () => void;
  children?: ReactNode;
}

/**
 * RetryableQuery component for displaying query errors with retry option
 * Used with TanStack Query to handle failed queries
 */
export function RetryableQuery({ error, onRetry, children }: RetryableQueryProps) {
  const isNetworkError = isAPIException(error) && error.code === ErrorCode.NETWORK_ERROR;

  const getErrorMessage = (): string => {
    if (isAPIException(error)) {
      switch (error.code) {
        case ErrorCode.NETWORK_ERROR:
          return 'Unable to connect to the server. Please check your internet connection.';
        case ErrorCode.NOT_FOUND:
          return 'The requested resource was not found.';
        case ErrorCode.UNAUTHORIZED:
          return 'You need to be logged in to view this content.';
        case ErrorCode.FORBIDDEN:
          return 'You do not have permission to view this content.';
        default:
          return error.message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  };

  return (
    <div className="w-full p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{isNetworkError ? 'Connection Error' : 'Error'}</AlertTitle>
        <AlertDescription>
          <p className="mb-4">{getErrorMessage()}</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          {children}
        </AlertDescription>
      </Alert>
    </div>
  );
}
