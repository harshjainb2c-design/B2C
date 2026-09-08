import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
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
    <AuthLayout
      headline="Recover Account"
      subtitle="Complete these easy steps to restore access to your account."
      steps={[
        { label: "Request reset email", active: true },
        { label: "Verify your identity" },
        { label: "Choose new password" },
      ]}
    >
      <div>
        <PasswordResetForm
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          error={error}
          success={resetPasswordSuccess}
        />
        <div className="mt-4 sm:mt-5 text-center">
          <Link
            to="/login"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Remember your credentials? <span className="text-white font-semibold hover:underline">Log In</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
