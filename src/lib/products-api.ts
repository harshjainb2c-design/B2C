import { supabase } from './supabase';
import { Product, ProductFilters, ProductListResponse } from '../types/product';

export const productsApi = {
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const offset = (page - 1) * limit;

      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.collection) params.set('collection', filters.collection);
      if (filters?.search) params.set('search', filters.search);
      params.set('page', String(page));
      params.set('limit', String(limit));

      let fetchedData: ProductListResponse | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.products)) {
            fetchedData = json;
          }
        }
      } catch {}

      if (!fetchedData) {
        let query = supabase.from('products').select('*', { count: 'exact' });

        if (filters?.includeInactive !== true) {
          query = query.eq('is_active', true);
        }

        if (filters?.category) {
          query = query.or(`category.eq.${filters.category},categories.cs.{${filters.category}}`);
        }

        if (filters?.collection) {
          query = query.eq('collection', filters.collection);
        }

        if (filters?.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }

        query = query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        const { data: products, error, count } = await query;

        if (error) {
          throw new Error(`Failed to fetch products: ${error.message}`);
        }

        const transformedProducts = (products || []).map((product: any) => ({
          ...product,
          isActive: product.is_active,
          categories: product.categories || [],
          collection: product.collection || undefined,
        }));

        fetchedData = {
          products: transformedProducts,
          total: count || 0,
          page,
          totalPages: count ? Math.ceil(count / limit) : 0,
        };
      }

      let filteredProducts = fetchedData.products || [];

      if (filters?.priceRange && filteredProducts.length > 0) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter((p) => p.price >= min && p.price <= max);
      }

      if (filters?.gender && filteredProducts.length > 0) {
        filteredProducts = filteredProducts.filter((p) => {
          const nameMatch = p.name.toLowerCase().includes(filters.gender!.toLowerCase());
          const specMatch = p.specifications?.gender?.toLowerCase() === filters.gender!.toLowerCase();
          return nameMatch || specMatch;
        });
      }

      if (filters?.itemType && filteredProducts.length > 0) {
        filteredProducts = filteredProducts.filter((p) => {
          const nameMatch = p.name.toLowerCase().includes(filters.itemType!.toLowerCase());
          const categoryMatch = p.category?.toLowerCase().includes(filters.itemType!.toLowerCase());
          const specMatch = p.specifications?.type?.toLowerCase() === filters.itemType!.toLowerCase();
          return nameMatch || categoryMatch || specMatch;
        });
      }

      if (filters?.sortBy && filteredProducts.length > 0) {
        filteredProducts = [...filteredProducts].sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-asc':
              return a.price - b.price;
            case 'price-desc':
              return b.price - a.price;
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            case 'newest':
            default:
              return 0;
          }
        });
      }

      const total = fetchedData.total || filteredProducts.length;
      const totalPages = Math.ceil(total / limit) || 1;

      return {
        products: filteredProducts,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const product = await res.json();
        if (product && product.id) {
          return product;
        }
      }
    } catch {}

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      isActive: product.is_active,
      categories: product.categories || [],
      collection: product.collection || undefined,
    };
  },
};
