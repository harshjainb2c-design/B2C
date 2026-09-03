import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartState {
  items: CartItem[];
}

interface CartActions {
  addItem: (product: Product, quantity: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setItems: (items: CartItem[]) => void;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (product, quantity, size) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.productId === product.id && item.size === size
        );

        if (existingItemIndex > -1) {
          // Update quantity if item already exists with same size
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            product,
            quantity,
            price: product.price,
            size,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId, size) => {
        const { items } = get();
        set({ items: items.filter((item) => !(item.productId === productId && item.size === size)) });
      },

      updateQuantity: (productId, quantity, size) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          set({ items: items.filter((item) => !(item.productId === productId && item.size === size)) });
          return;
        }

        const updatedItems = items.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      setItems: (items) => {
        set({ items });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
