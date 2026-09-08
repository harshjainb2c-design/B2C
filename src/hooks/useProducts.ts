import { useQuery, useInfiniteQuery, UseQueryResult } from '@tanstack/react-query';
import { productsApi } from '../lib/products-api';
import { Product, ProductFilters, ProductListResponse } from '../types/product';

const fetchProducts = async (filters?: ProductFilters): Promise<ProductListResponse> => {
  return productsApi.getProducts(filters);
};

const fetchProduct = async (id: string): Promise<Product> => {
  return productsApi.getProduct(id);
};

export const useProducts = (
  filters?: ProductFilters
): UseQueryResult<ProductListResponse, Error> => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
  });
};

export const useInfiniteProducts = (
  filters?: Omit<ProductFilters, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: ['products-infinite', filters],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
  });
};

export const useProduct = (
  id: string
): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
};
