import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RegisterRequest } from '../../types/user';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      const validatedData = registerSchema.parse(data);
      const { confirmPassword, ...registerData } = validatedData;
      await onSubmit(registerData);
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
        <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-1.5 font-medium">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', { required: true })}
          className={`w-full px-3.5 py-3 border bg-black text-white text-sm placeholder-neutral-500 focus:outline-none transition-colors ${
            errors.fullName 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-neutral-800 focus:border-white'
          }`}
          placeholder="First & Last Name"
          disabled={isLoading}
          aria-invalid={errors.fullName ? 'true' : 'false'}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="mt-1.5 text-xs font-mono text-red-400">
            {errors.fullName.message}
          </p>
        )}
      </div>

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
            aria-describedby={errors.password ? 'password-error password-hint' : 'password-hint'}
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
        <p id="password-hint" className="mt-1 text-[11px] font-mono text-neutral-500">
          8+ chars with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-1.5 font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', { required: true })}
            className={`w-full px-3.5 py-3 pr-16 border bg-black text-white text-sm placeholder-neutral-500 focus:outline-none transition-colors ${
              errors.confirmPassword 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-neutral-800 focus:border-white'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1.5 text-xs font-mono text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};
