import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { RegisterRequest } from "../../types/user";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
    await onSubmit({
      email: data.email.trim(),
      password: data.password,
      fullName: fullName || data.firstName,
    });
  };

  return (
    <div className="w-full font-inter">
      <div className="text-center sm:text-left mb-6 sm:mb-5">
        <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-white">
          Sign Up Account
        </h1>
        <p className="mt-2 sm:mt-1.5 text-sm sm:text-xs text-neutral-400">
          Enter your personal data to create your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-3">
        {error && (
          <div className="p-3 sm:p-2.5 rounded-lg text-sm sm:text-xs text-white bg-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-2.5">
          <div>
            <label className="block text-sm sm:text-xs font-medium text-neutral-200 mb-1.5 sm:mb-1">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName")}
              placeholder="eg. John"
              className={`w-full px-4 py-3 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#09090b] border text-white text-base sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0 transition-none ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/10 focus:border-white/10"
              }`}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs sm:text-[11px] text-red-400">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm sm:text-xs font-medium text-neutral-200 mb-1.5 sm:mb-1">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName")}
              placeholder="eg. Francisco"
              className="w-full px-4 py-3 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#09090b] border border-white/10 text-white text-base sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus:border-white/10 transition-none"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm sm:text-xs font-medium text-neutral-200 mb-1.5 sm:mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="eg. johnfrans@gmail.com"
            className={`w-full px-4 py-3 sm:px-3.5 sm:py-2.5 rounded-lg bg-[#09090b] border text-white text-base sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0 transition-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-white/10"
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-xs sm:text-[11px] text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm sm:text-xs font-medium text-neutral-200 mb-1.5 sm:mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 sm:px-3.5 sm:py-2.5 pr-11 rounded-lg bg-[#09090b] border text-white text-base sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0 transition-none ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/10 focus:border-white/10"
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5 sm:w-4 sm:h-4" /> : <Eye className="w-5 h-5 sm:w-4 sm:h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs sm:text-[11px] text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 sm:mt-2.5 py-3.5 sm:py-3 px-4 text-base sm:text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm sm:text-xs text-neutral-400 mt-6 sm:mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-white font-semibold hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
};
