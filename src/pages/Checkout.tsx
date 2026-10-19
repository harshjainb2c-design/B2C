import { useNavigate } from 'react-router-dom';
import { CheckoutForm } from '../components/checkout/CheckoutForm';

export const Checkout = () => {
  const navigate = useNavigate();

  const handleSuccess = (order: any) => {
    const orderId = typeof order === 'string' ? order : order?.id;
    navigate(`/order-confirmation/${orderId}`, { state: { order: typeof order === 'object' ? order : undefined } });
  };

  return <CheckoutForm onSuccess={handleSuccess} />;
};
