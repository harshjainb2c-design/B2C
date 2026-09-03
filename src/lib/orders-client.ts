import { supabase } from './supabase';
import { CreateOrderRequest, Order } from '../types/order';
import { useAuthStore } from '../stores/authStore';

/**
 * Create an order directly in Supabase (client-side)
 * Used when API is not available or authentication fails
 */
export const createOrderDirect = async (request: CreateOrderRequest): Promise<Order> => {
  const user = useAuthStore.getState().user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const total = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderData = {
    user_id: user.id,
    items: request.items,
    total,
    status: 'pending',
    shipping_address: request.shippingAddress,
    payment_intent_id: request.paymentIntentId,
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  if (!order) {
    throw new Error('Order creation failed - no data returned');
  }

  // Transform to match Order type
  return {
    id: order.id,
    userId: order.user_id,
    items: order.items,
    total: order.total,
    status: order.status,
    shippingAddress: order.shipping_address,
    paymentIntentId: order.payment_intent_id,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
};
