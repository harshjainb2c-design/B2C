import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  fit?: string;
  fabric?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistActions {
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => boolean;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'tr-1',
          name: 'Dragon Ball Z: Kaio-Ken X3',
          category: 'Super Oversized T-Shirts',
          price: 1599,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80',
          fit: 'OVERSIZED FIT',
          fabric: 'PREMIUM INTERLOCK FABRIC',
        },
        {
          id: 'tr-2',
          name: 'Spider-Man: Rise Of The Spider',
          category: 'Oversized T-Shirts',
          price: 1599,
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80',
          fit: 'OVERSIZED FIT',
          fabric: 'PREMIUM HEAVY GAUGE FABRIC',
        },
      ],

      addItem: (item) => {
        const { items } = get();
        if (!items.some((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== id) });
      },

      toggleItem: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: items.filter((i) => i.id !== item.id) });
          return false;
        } else {
          set({ items: [...items, item] });
          return true;
        }
      },

      isWishlisted: (id) => {
        return get().items.some((i) => i.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'b2c-wishlist-storage',
    }
  )
);
