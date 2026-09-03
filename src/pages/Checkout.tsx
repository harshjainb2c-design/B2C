import { useNavigate } from 'react-router-dom';
import { RazorpayCheckoutForm } from '../components/checkout/RazorpayCheckoutForm';

export const Checkout = () => {
  const navigate = useNavigate();

  const handleSuccess = (orderId: string) => {
    // Redirect to order confirmation page
    navigate(`/order-confirmation/${orderId}`);
  };

  return <RazorpayCheckoutForm onSuccess={handleSuccess} />;
};
