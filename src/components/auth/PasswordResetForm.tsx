import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResetPasswordRequest } from '../../types/user';

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
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    await onSubmit({
      email: data.email.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-3 font-inter">
      <div className="text-center sm:text-left mb-6 sm:mb-5">
        <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-white">
          Reset Password
        </h1>
        <p className="mt-2 sm:mt-1.5 text-sm sm:text-xs text-neutral-400">
          Enter your email to receive a recovery link.
        </p>
      </div>

      {error && (
        <div className="p-3 sm:p-2.5 rounded-lg text-sm sm:text-xs text-white bg-red-600 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 sm:p-2.5 rounded-lg text-sm sm:text-xs text-white bg-emerald-600 font-medium">
          If an account exists with this email, a reset link has been dispatched.
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm sm:text-xs font-medium text-neutral-200 mb-1.5 sm:mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-4 py-3 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#09090b] border text-white text-base sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0 transition-none ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-white/10"
          }`}
          placeholder="eg. johnfrans@gmail.com"
          disabled={isLoading || success}
        />
        {errors.email && (
          <p className="mt-1 text-xs sm:text-[11px] text-red-400">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full mt-3 sm:mt-2.5 py-3.5 sm:py-3 px-4 text-base sm:text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        {isLoading ? 'Sending...' : success ? 'Link Dispatched' : 'Send Reset Link'}
      </button>
    </form>
  );
};
