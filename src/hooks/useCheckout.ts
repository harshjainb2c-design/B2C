import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { CreateOrderRequest, Order, OrderStatus } from '../types/order';

/**
 * Response from create payment intent endpoint
 */
interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Request for creating payment intent
 */
interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
}

/**
 * Hook for creating a payment intent with Stripe
 */
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (request: CreatePaymentIntentRequest) => {
      return apiClient.post<CreatePaymentIntentResponse>(
        '/payments',
        request
      );
    },
    onError: () => {
      // Handle payment intent error
    },
  });
};

/**
 * Hook for creating an order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      return apiClient.post<Order>('/orders', request, {
        requiresAuth: true,
      });
    },
    onMutate: async (newOrder) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData(['orders']);

      // Optimistically update with a temporary order
      const tempOrder: Order = {
        id: 'temp-' + Date.now(),
        userId: '',
        items: newOrder.items,
        total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: OrderStatus.PENDING,
        shippingAddress: newOrder.shippingAddress,
        paymentIntentId: newOrder.paymentIntentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(['orders'], (old: any) => {
        if (!old) return [tempOrder];
        return [tempOrder, ...old];
      });

      return { previousOrders };
    },
    onSuccess: (newOrder) => {
      // Replace temp order with real order
      queryClient.setQueryData(['orders'], (old: any) => {
        if (!old) return [newOrder];
        return old.map((order: Order) => 
          order.id.startsWith('temp-') ? newOrder : order
        );
      });
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (_error, _newOrder, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    // Retry failed requests
    retry: 1,
    retryDelay: 2000,
  });
};

/**
 * Combined checkout hook that handles the full payment and order creation flow
 */
export const useCheckout = () => {
  const createPaymentIntent = useCreatePaymentIntent();
  const createOrder = useCreateOrder();

  return {
    createPaymentIntent,
    createOrder,
    isProcessing: createPaymentIntent.isPending || createOrder.isPending,
  };
};
