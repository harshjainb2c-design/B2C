import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ResetPasswordRequest } from '../../types/user';

// Validation schema
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  onSubmit: (data: ResetPasswordRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: boolean;
}

export const PasswordResetForm = ({
  onSubmit,
  isLoading,
  error,
  success,
}: PasswordResetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Validate with Zod
      const validatedData = resetPasswordSchema.parse(data);
      await onSubmit(validatedData);
    } catch (err) {
      // Handle validation error
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          If an account exists with this email, a password reset link has been sent.
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          disabled={isLoading || success}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Sending...' : success ? 'Email Sent' : 'Send Reset Link'}
      </button>
    </form>
  );
};
