import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import { Product } from '../types/product';

describe('cartStore', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 29.99,
    category: 'electronics',
    images: ['https://example.com/image.jpg'],
    stock: 10,
    isActive: true,
    specifications: {},
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 49.99,
    category: 'electronics',
    images: ['https://example.com/image2.jpg'],
    stock: 5,
    isActive: true,
    specifications: {},
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('1');
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].price).toBe(29.99);
    });

    it('should increase quantity when adding existing item', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      addItem(mockProduct, 3);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('should add multiple different products', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 1);
      addItem(mockProduct2, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].productId).toBe('1');
      expect(state.items[1].productId).toBe('2');
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', () => {
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      addItem(mockProduct2, 1);
      
      removeItem('1');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('2');
    });

    it('should handle removing non-existent item', () => {
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      removeItem('non-existent-id');
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      updateQuantity('1', 5);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      updateQuantity('1', 0);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      updateQuantity('1', -1);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);
      
      clearCart();
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total price correctly', () => {
      const { addItem, getTotal } = useCartStore.getState();
      
      addItem(mockProduct, 2); // 2 * 29.99 = 59.98
      addItem(mockProduct2, 1); // 1 * 49.99 = 49.99
      
      const total = getTotal();
      expect(total).toBe(109.97);
    });

    it('should return 0 for empty cart', () => {
      const { getTotal } = useCartStore.getState();
      
      const total = getTotal();
      expect(total).toBe(0);
    });
  });

  describe('getItemCount', () => {
    it('should calculate total item count correctly', () => {
      const { addItem, getItemCount } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);
      
      const count = getItemCount();
      expect(count).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      const { getItemCount } = useCartStore.getState();
      
      const count = getItemCount();
      expect(count).toBe(0);
    });
  });

  describe('setItems', () => {
    it('should replace all items in cart', () => {
      const { addItem, setItems } = useCartStore.getState();
      
      addItem(mockProduct, 2);
      
      const newItems = [
        {
          productId: '2',
          product: mockProduct2,
          quantity: 5,
          price: mockProduct2.price,
        },
      ];
      
      setItems(newItems);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe('2');
      expect(state.items[0].quantity).toBe(5);
    });
  });
});
