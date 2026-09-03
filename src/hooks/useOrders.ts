import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../lib/orders-api';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook for fetching user's orders
 */
export const useOrders = () => {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return ordersApi.getOrders();
    },
    enabled: !!user && isInitialized, // Only fetch if user is authenticated AND auth is initialized
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loops
  });
};

/**
 * Hook for fetching a single order by ID
 */
export const useOrder = (orderId: string) => {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      return ordersApi.getOrder(orderId);
    },
    enabled: !!user && !!orderId && isInitialized, // Only fetch if user is authenticated and orderId is provided AND auth is initialized
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loops
  });
};
