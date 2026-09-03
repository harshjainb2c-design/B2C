import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  categories?: string[];
  collection?: string;
  images: string[];
  stock: number;
  isActive?: boolean;
  specifications?: Record<string, string>;
  sizes?: string[];
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

/**
 * Hook for creating a new product (admin only)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/admin?resource=products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        const result = await response.json();
        return result as Product;
      } catch (error) {
        // Fallback to direct Supabase insert
        const productData = {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          categories: data.categories || [],
          collection: data.collection || null,
          images: data.images,
          stock: data.stock,
          is_active: data.isActive ?? true,
          specifications: data.specifications || {},
          sizes: data.sizes || null,
        };

        const { data: product, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (insertError) {
          throw new Error(`Failed to create product: ${insertError.message}`);
        }

        // Transform to match Product type
        return {
          ...product,
          isActive: product.is_active,
          categories: product.categories || [],
          collection: product.collection || undefined,
        } as Product;
      }
    },
    onSuccess: () => {
      // Invalidate products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook for updating an existing product (admin only)
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProductData) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`/api/admin?resource=products&id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        const result = await response.json();
        return result as Product;
      } catch (error) {
        // Fallback to direct Supabase update
        const updates: any = {};
        
        if (data.name !== undefined) updates.name = data.name;
        if (data.description !== undefined) updates.description = data.description;
        if (data.price !== undefined) updates.price = data.price;
        if (data.category !== undefined) updates.category = data.category;
        if (data.categories !== undefined) updates.categories = data.categories;
        if (data.collection !== undefined) updates.collection = data.collection || null;
        if (data.images !== undefined) updates.images = data.images;
        if (data.stock !== undefined) updates.stock = data.stock;
        if (data.isActive !== undefined) updates.is_active = data.isActive;
        if (data.specifications !== undefined) updates.specifications = data.specifications;
        if (data.sizes !== undefined) updates.sizes = data.sizes || null;
        
        updates.updated_at = new Date().toISOString();

        const { data: product, error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update product: ${updateError.message}`);
        }

        // Transform to match Product type
        return {
          ...product,
          isActive: product.is_active,
          categories: product.categories || [],
          collection: product.collection || undefined,
        } as Product;
      }
    },
    onSuccess: (data) => {
      // Invalidate products queries to force refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      // Also refetch immediately
      queryClient.refetchQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook for deleting a product (admin only)
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`/api/admin?resource=products&id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('API failed');
        }

        const result = await response.json();
        return result;
      } catch (error) {
        // Fallback to direct Supabase delete
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (deleteError) {
          throw new Error(`Failed to delete product: ${deleteError.message}`);
        }

        return { message: 'Product deleted successfully', id };
      }
    },
    onSuccess: () => {
      // Invalidate products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
