import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginRequest } from '../../types/user';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      const validatedData = loginSchema.parse(data);
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

      <div>
        <label htmlFor="email" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-1.5 font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true })}
          className={`w-full px-3.5 py-3 border bg-black text-white text-sm placeholder-neutral-500 focus:outline-none transition-colors ${
            errors.email 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-neutral-800 focus:border-white'
          }`}
          placeholder="your@email.com"
          disabled={isLoading}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs font-mono text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-1.5 font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: true })}
            className={`w-full px-3.5 py-3 pr-16 border bg-black text-white text-sm placeholder-neutral-500 focus:outline-none transition-colors ${
              errors.password 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-neutral-800 focus:border-white'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-xs font-mono text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};
