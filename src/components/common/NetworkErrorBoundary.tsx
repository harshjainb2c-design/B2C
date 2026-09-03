import { ReactNode } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface NetworkErrorBoundaryProps {
  children: ReactNode;
}

/**
 * NetworkErrorBoundary component for handling network errors
 * Provides retry functionality for failed requests
 */
export function NetworkErrorBoundary({ children }: NetworkErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onError={() => {
        // Handle network errors
      }}
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                <p className="mb-4">
                  Unable to connect to the server. Please check your internet connection and try again.
                </p>
                <button
                  onClick={() => {
                    reset();
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
