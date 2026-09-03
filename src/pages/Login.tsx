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
      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-gray-900 hover:text-gray-700 underline"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 border border-gray-200 py-8 px-4 sm:px-10">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Forgot your password?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-gray-900 hover:text-gray-700 underline"
              >
                Reset password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
