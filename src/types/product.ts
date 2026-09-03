export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categories?: string[]; // Multiple categories support
  collection?: string; // e.g., "new-arrival", "fresh-drop", "winter", "summer"
  images: string[];
  stock: number;
  isActive: boolean;
  specifications: Record<string, string>;
  sizes?: string[]; // Optional sizes (e.g., ["S", "M", "L", "XL"])
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  collection?: string; // For filtering by collection (winter, summer, new-arrival, etc.)
  gender?: string;
  itemType?: string;
  priceRange?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean; // For admin views to show all products
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
