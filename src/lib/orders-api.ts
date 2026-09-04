import { supabase } from './supabase';
import { Order, OrderListResponse } from '../types/order';
import { useAuthStore } from '../stores/authStore';

/**
 * Direct Supabase implementation for orders API
 * Used for local development when Vercel functions aren't available
 */

export const ordersApi = {
  /**
   * Fetch all orders for the current user
   */
  async getOrders(): Promise<OrderListResponse> {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    // Transform the data to match our Order type
    const transformedOrders: Order[] = (orders || []).map((order: any) => ({
      id: order.id,
      userId: order.user_id,
      items: order.items, // items is stored as JSON in the orders table
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
      total: transformedOrders.length,
    };
  },

  /**
   * Fetch a single order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Order not found');
      }
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    if (!order) {
      throw new Error('Order not found');
    }

    // Transform the data to match our Order type
    return {
      id: order.id,
      userId: order.user_id,
      items: order.items, // items is stored as JSON in the orders table
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
  },
};
