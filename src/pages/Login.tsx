import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/user';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    try {
      setError(null);
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
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
            Sign In
          </h1>
          <p className="mt-2 text-xs font-mono text-neutral-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white hover:text-neutral-300 underline underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>

        <div className="bg-black border border-neutral-800 p-6 sm:p-10 shadow-2xl">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          <div className="mt-6 pt-6 border-t border-neutral-900 text-center">
            <Link
              to="/reset-password"
              className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
