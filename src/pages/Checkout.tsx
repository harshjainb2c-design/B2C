import { useNavigate } from 'react-router-dom';
import { CheckoutForm } from '../components/checkout/CheckoutForm';

export const Checkout = () => {
  const navigate = useNavigate();

  const handleSuccess = (orderId: string) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  return <CheckoutForm onSuccess={handleSuccess} />;
};
