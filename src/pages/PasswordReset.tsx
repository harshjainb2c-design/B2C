import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PasswordResetForm } from '../components/auth/PasswordResetForm';
import { useAuth } from '../hooks/useAuth';
import { ResetPasswordRequest } from '../types/user';

export const PasswordReset = () => {
  const { resetPassword, resetPasswordSuccess } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (data: ResetPasswordRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      await resetPassword(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:text-gray-700 underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 border border-gray-200 py-8 px-4 sm:px-10">
          <PasswordResetForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
            error={error}
            success={resetPasswordSuccess}
          />

          {resetPasswordSuccess && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-900 hover:text-gray-700 underline"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
