import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types/user';

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setError(null);
      await registerUser(data);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
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
            Create Account
          </h1>
          <p className="mt-2 text-xs font-mono text-neutral-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white hover:text-neutral-300 underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="bg-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-6 pt-6 border-t border-neutral-900 text-center">
            <p className="text-[11px] font-mono text-neutral-500">
              By joining, you agree to our{' '}
              <Link to="/terms" className="text-neutral-400 hover:text-white underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-neutral-400 hover:text-white underline">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
