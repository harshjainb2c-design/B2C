import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus } from '../types/order';
import { supabase } from '../lib/supabase';

interface AdminOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

interface AdminOrdersFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

/**
 * Hook for fetching all orders (admin only)
 */
export const useAdminOrders = (filters?: AdminOrdersFilters) => {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      // Try API first, fallback to direct Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const params = new URLSearchParams({ resource: 'orders' });
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(`/api/admin?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        return response.json() as Promise<AdminOrdersResponse>;
      } catch (error) {
        // Fallback to direct Supabase query
        const { fetchOrdersDirect } = await import('../lib/admin-client');
        const result = await fetchOrdersDirect({ status: filters?.status });
        return {
          orders: result.orders,
          total: result.total,
          page: filters?.page || 1,
          totalPages: Math.ceil(result.total / (filters?.limit || 20)),
        };
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for updating order status (admin only)
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      // Try API first, fallback to direct Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`/api/admin?resource=orders&id=${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        return response.json() as Promise<Order>;
      } catch (error) {
        // Fallback to direct Supabase update
        const { updateOrderStatusDirect } = await import('../lib/admin-client');
        return await updateOrderStatusDirect(orderId, status);
      }
    },
    onSuccess: () => {
      // Invalidate admin orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};
