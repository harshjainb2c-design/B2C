import { useForm } from 'react-hook-form';
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
  } = useForm<ResetPasswordFormData>();

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      const validatedData = resetPasswordSchema.parse(data);
      await onSubmit(validatedData);
    } catch {
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-xs font-mono text-red-400 bg-red-950/30 border border-red-900/60">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/60">
          If an account exists with this email, a password reset link has been dispatched.
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-1.5 font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className="w-full px-3.5 py-3 border border-neutral-800 bg-black text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          placeholder="your@email.com"
          disabled={isLoading || success}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs font-mono text-red-400">{errors.email.message}</p>
        )}
        <p className="mt-2 text-[11px] font-mono text-neutral-500">
          We will send a recovery link directly to your inbox.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full mt-2 py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Sending...' : success ? 'Email Dispatched' : 'Send Reset Link'}
      </button>
    </form>
  );
};
