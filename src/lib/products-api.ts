import { supabase } from './supabase';
import { Product, ProductFilters, ProductListResponse } from '../types/product';

/**
 * Direct Supabase implementation for products API
 * Used for local development when Vercel functions aren't available
 */

export const productsApi = {
  /**
   * Fetch products with filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const offset = (page - 1) * limit;

      // Build query
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      // Only filter by active status if not explicitly requesting all products
      if (filters?.includeInactive !== true) {
        query = query.eq('is_active', true);
      }

      // Apply category filter - check both single category and categories array
      if (filters?.category) {
        // Use OR condition to check both category field and categories array
        query = query.or(`category.eq.${filters.category},categories.cs.{${filters.category}}`);
      }

      // Apply collection filter
      if (filters?.collection) {
        query = query.eq('collection', filters.collection);
      }

      // Apply search filter
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: products, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      // Apply client-side filters for fields not in database
      let filteredProducts = products || [];
      
      // Filter by price range
      if (filters?.priceRange && filteredProducts.length > 0) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
      }

      // Filter by gender (check in specifications or name)
      if (filters?.gender && filteredProducts.length > 0) {
        filteredProducts = filteredProducts.filter(p => {
          const nameMatch = p.name.toLowerCase().includes(filters.gender!.toLowerCase());
          const specMatch = p.specifications?.gender?.toLowerCase() === filters.gender!.toLowerCase();
          return nameMatch || specMatch;
        });
      }

      // Filter by item type (check in specifications, name, or category)
      if (filters?.itemType && filteredProducts.length > 0) {
        filteredProducts = filteredProducts.filter(p => {
          const nameMatch = p.name.toLowerCase().includes(filters.itemType!.toLowerCase());
          const categoryMatch = p.category?.toLowerCase().includes(filters.itemType!.toLowerCase());
          const specMatch = p.specifications?.type?.toLowerCase() === filters.itemType!.toLowerCase();
          return nameMatch || categoryMatch || specMatch;
        });
      }

      // Apply client-side sorting if sortBy is provided
      let sortedProducts = filteredProducts;
      if (filters?.sortBy && sortedProducts.length > 0) {
        sortedProducts = [...sortedProducts].sort((a, b) => {
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
              // Already sorted by created_at desc in query
              return 0;
          }
        });
      }

      // Adjust count and pagination based on client-side filtering
      const actualCount = sortedProducts.length;
      const hasClientFilters = filters?.priceRange || filters?.gender || filters?.itemType;
      
      // If we have client-side filters, we need to recalculate pagination
      const finalTotal = hasClientFilters ? actualCount : (count || 0);
      const totalPages = Math.ceil(finalTotal / limit);

      // Transform products to match Product type (is_active -> isActive)
      const transformedProducts = sortedProducts.map((product: any) => ({
        ...product,
        isActive: product.is_active,
        categories: product.categories || [],
        collection: product.collection || undefined,
      }));

      return {
        products: transformedProducts,
        total: finalTotal,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
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

    // Transform to match Product type (is_active -> isActive)
    return {
      ...product,
      isActive: product.is_active,
      categories: product.categories || [],
      collection: product.collection || undefined,
    };
  },
};
