import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { productsApi } from '../lib/products-api';
import { Product, ProductFilters, ProductListResponse } from '../types/product';

/**
 * Fetch products with filters
 */
const fetchProducts = async (filters?: ProductFilters): Promise<ProductListResponse> => {
  return productsApi.getProducts(filters);
};

/**
 * Fetch a single product by ID
 */
const fetchProduct = async (id: string): Promise<Product> => {
  return productsApi.getProduct(id);
};

/**
 * Hook to fetch products with filters
 * 
 * @param filters - Optional filters for products (category, search, page, limit)
 * @returns Query result with products list
 */
export const useProducts = (
  filters?: ProductFilters
): UseQueryResult<ProductListResponse, Error> => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once to avoid infinite loops
    refetchOnMount: true, // Refetch when component mounts
  });
};

/**
 * Hook to fetch a single product by ID
 * 
 * @param id - Product ID
 * @returns Query result with product details
 */
export const useProduct = (
  id: string
): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id, // Only run query if ID is provided
    retry: 1, // Only retry once to avoid infinite loops
  });
};
