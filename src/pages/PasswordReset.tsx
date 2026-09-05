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
    <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <span className="text-[11px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
            B2C Archive
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
            Reset Password
          </h1>
          <p className="mt-2 text-xs font-mono text-neutral-400">
            Remember your credentials?{' '}
            <Link
              to="/login"
              className="text-white hover:text-neutral-300 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="bg-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
          <PasswordResetForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
            error={error}
            success={resetPasswordSuccess}
          />

          {resetPasswordSuccess && (
            <div className="mt-6 pt-6 border-t border-neutral-900 text-center">
              <Link
                to="/login"
                className="text-xs font-mono uppercase tracking-wider text-white hover:text-neutral-300 underline"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
