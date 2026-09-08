import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/user';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const rawFrom = (location.state as any)?.from;
  const destination = typeof rawFrom === 'string' ? rawFrom : rawFrom?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true });
    }
  }, [user, navigate, destination]);

  const handleLogin = async (data: LoginRequest) => {
    try {
      setError(null);
      await login(data);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  return (
    <AuthLayout
      headline="Welcome Back"
      subtitle="Complete these easy steps to access your account."
      steps={[
        { label: "Sign in to your account", active: true },
        { label: "Access your bag & wishlist" },
        { label: "Track orders & deliveries" },
      ]}
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </AuthLayout>
  );
};
