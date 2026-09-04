import { supabase } from './supabase';
import { Order, OrderStatus } from '../types/order';
import { useAuthStore } from '../stores/authStore';

/**
 * Fetch all orders directly from Supabase (admin only)
 */
export const fetchOrdersDirect = async (filters?: { status?: OrderStatus }): Promise<{ orders: Order[]; total: number }> => {
  const user = useAuthStore.getState().user;
  
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data: orders, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  // Transform to match Order type
  const transformedOrders: Order[] = (orders || []).map((order: any) => ({
    id: order.id,
    userId: order.user_id,
    items: order.items,
    total: order.total,
    status: order.status,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method || 'cod',
    paymentStatus: order.payment_status || 'pending_collection',
    fulfillmentStatus: order.fulfillment_status || 'pending',
    shiprocketOrderId: order.shiprocket_order_id || undefined,
    shiprocketShipmentId: order.shiprocket_shipment_id || undefined,
    awbCode: order.awb_code || undefined,
    courierName: order.courier_name || undefined,
    trackingStatus: order.tracking_status || undefined,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }));

  return {
    orders: transformedOrders,
    total: count || 0,
  };
};

/**
 * Update order status directly in Supabase (admin only)
 */
export const updateOrderStatusDirect = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const user = useAuthStore.getState().user;
  
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  if (!order) {
    throw new Error('Order not found');
  }

  // Transform to match Order type
  return {
    id: order.id,
    userId: order.user_id,
    items: order.items,
    total: order.total,
    status: order.status,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method || 'cod',
    paymentStatus: order.payment_status || 'pending_collection',
    fulfillmentStatus: order.fulfillment_status || 'pending',
    shiprocketOrderId: order.shiprocket_order_id || undefined,
    shiprocketShipmentId: order.shiprocket_shipment_id || undefined,
    awbCode: order.awb_code || undefined,
    courierName: order.courier_name || undefined,
    trackingStatus: order.tracking_status || undefined,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  };
};
