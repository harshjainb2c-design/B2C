import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types/user';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const rawFrom = (location.state as any)?.from;
  const destination = typeof rawFrom === 'string' ? rawFrom : rawFrom?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true });
    }
  }, [user, navigate, destination]);

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setError(null);
      await registerUser(data);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <AuthLayout
      headline="Get Started with Us"
      subtitle="Complete these easy steps to register your account."
      steps={[
        { label: "Sign up your account", active: true },
        { label: "Set up your profile" },
        { label: "Explore curated drops" },
      ]}
    >
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  );
};
