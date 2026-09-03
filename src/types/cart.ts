import { Product } from './product';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string; // Optional size selection
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface LocalCart {
  items: CartItem[];
  updatedAt: string;
}
