import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../lib/api-client';
import { Cart } from '../types/cart';
import { Product } from '../types/product';

/**
 * Hook for managing shopping cart with API integration
 */
export const useCart = () => {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, setItems } = cartStore;
  const { user } = useAuthStore();

  // Mutation for adding item to cart (server)
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return apiClient.post<Cart>('/cart', { productId, quantity }, { requiresAuth: true });
    },
    onSuccess: (data) => {
      // Update local store with server response
      setItems(data.items);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    // Don't retry on 404 (API not available), 500 (server error), or 401 (auth error)
    retry: (failureCount, error: any) => {
      if (error?.apiError?.status === 404 || error?.apiError?.status === 500 || error?.apiError?.status === 401) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation for syncing local cart with server
  const syncCartMutation = useMutation({
    mutationFn: async (cartItems: typeof items) => {
      return apiClient.post<Cart>('/cart?action=sync', { items: cartItems }, { requiresAuth: true });
    },
    onMutate: async (newItems) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update to the new value
      queryClient.setQueryData(['cart'], { items: newItems });

      // Return context with the previous value
      return { previousCart };
    },
    onSuccess: (data) => {
      // Update local store with merged cart from server
      setItems(data.items);
      queryClient.setQueryData(['cart'], data);
    },
    onError: (error: any, _newItems, context) => {
      // If API is not available (404), has server error (500), or auth fails (401), just keep local state
      if (error?.apiError?.status === 404 || error?.apiError?.status === 500 || error?.apiError?.status === 401) {
        return;
      }
      
      // Rollback to the previous value on other errors
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    // Don't retry on 404 (API not available locally)
    retry: (failureCount, error: any) => {
      if (error?.apiError?.status === 404) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Sync cart with server when user logs in
  useEffect(() => {
    if (user && items.length > 0) {
      syncCartMutation.mutate(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only run when user ID changes

  /**
   * Add item to cart
   * If user is authenticated, sync with server
   */
  const handleAddItem = async (product: Product, quantity: number, size?: string) => {
    // Check if item already exists in cart
    const existingItem = items.find(
      item => item.productId === product.id && item.size === size
    );
    
    // Calculate total quantity after adding
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    
    // Validate stock before adding - cap at available stock
    if (product.stock < totalQuantity) {
      const availableToAdd = product.stock - (existingItem?.quantity || 0);
      if (availableToAdd <= 0) {
        throw new Error(`Cannot add more. Already have maximum available stock (${product.stock}) in cart`);
      }
      // Adjust quantity to what's actually available
      quantity = availableToAdd;
      console.warn(`Only ${availableToAdd} more items can be added (${product.stock} total in stock, ${existingItem?.quantity || 0} already in cart)`);
    }

    // Add to local store immediately for optimistic update
    addItem(product, quantity, size);

    // If user is authenticated, try to sync with server
    if (user) {
      try {
        await addToCartMutation.mutateAsync({
          productId: product.id,
          quantity,
        });
      } catch (error: any) {
        // If API is not available (404), has server error (500), or auth fails (401), keep local state
        if (error?.apiError?.status === 404 || error?.apiError?.status === 500 || error?.apiError?.status === 401) {
          return;
        }
        // Revert local change if server update fails for other reasons
        removeItem(product.id, size);
        throw error;
      }
    }
  };

  /**
   * Remove item from cart
   */
  const handleRemoveItem = (productId: string, size?: string) => {
    // Update local state immediately
    removeItem(productId, size);
    
    // If user is authenticated, sync with server (but don't block on it)
    if (user) {
      const updatedItems = items.filter(item => !(item.productId === productId && item.size === size));
      syncCartMutation.mutate(updatedItems);
    }
  };

  /**
   * Update item quantity
   */
  const handleUpdateQuantity = (productId: string, quantity: number, size?: string) => {
    // Find the item to validate stock
    const item = items.find(i => i.productId === productId && i.size === size);
    
    if (item && item.product.stock < quantity) {
      console.warn(`Only ${item.product.stock} items available in stock`);
      // Cap quantity at available stock instead of throwing
      quantity = item.product.stock;
    }

    // Update local state immediately
    updateQuantity(productId, quantity, size);
    
    // If user is authenticated, sync with server (but don't block on it)
    if (user) {
      const updatedItems = items.map(item =>
        item.productId === productId && item.size === size ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);
      
      syncCartMutation.mutate(updatedItems);
    }
  };

  /**
   * Clear cart
   */
  const handleClearCart = () => {
    clearCart();
    
    // If user is authenticated, sync with server
    if (user) {
      syncCartMutation.mutate([]);
    }
  };

  /**
   * Validate cart items against current stock
   * Returns items with insufficient stock
   */
  const validateStock = () => {
    const insufficientStockItems = items.filter(
      item => item.product.stock < item.quantity
    );
    
    return {
      isValid: insufficientStockItems.length === 0,
      insufficientStockItems,
    };
  };

  /**
   * Sync cart with server (manual trigger)
   */
  const syncCart = () => {
    if (user) {
      syncCartMutation.mutate(items);
    }
  };

  return {
    // Cart state
    items,
    total: getTotal(),
    itemCount: getItemCount(),
    
    // Cart actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    
    // Validation
    validateStock,
    
    // Sync
    syncCart,
    isSyncing: syncCartMutation.isPending,
    
    // Loading states
    isAddingItem: addToCartMutation.isPending,
  };
};
