import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../../types/product';
import { useState } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';

// Predefined categories - values match what's used in filters and links
const CATEGORIES = [
  { label: 'Upper Wear', value: 'upper' },
  { label: 'Bottom Wear', value: 'bottom' },
  { label: 'Footwear', value: 'shoes' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Activewear', value: 'activewear' },
  { label: 'Formal Wear', value: 'formal' },
  { label: 'Casual Wear', value: 'casual' },
  { label: 'Ethnic Wear', value: 'ethnic' },
  { label: 'Winter Wear', value: 'winter-wear' },
  { label: 'Summer Wear', value: 'summer-wear' },
];

// Collection tags
const COLLECTIONS = [
  { value: 'new-arrival', label: 'New Arrival' },
  { value: 'fresh-drop', label: 'Fresh Drop' },
  { value: 'trending', label: 'Trending' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'winter', label: 'Winter Collection' },
  { value: 'summer', label: 'Summer Collection' },
  { value: 'sale', label: 'On Sale' },
  { value: 'limited', label: 'Limited Edition' },
];

const productFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Primary category is required'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
  isActive: z.boolean().optional(),
  collection: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema> & {
  images: string[];
  categories: string[];
  specifications: Record<string, string>;
  sizes?: string[];
};

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [images, setImages] = useState<string[]>(product?.images || ['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories || (product?.category ? [product.category] : [])
  );
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    product?.specifications || {}
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [newSize, setNewSize] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<ProductFormData, 'images' | 'categories' | 'specifications'>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          isActive: product.isActive,
          collection: product.collection || '',
        }
      : {
          isActive: true,
          collection: '',
        },
  });

  const handleFormSubmit = (data: Omit<ProductFormData, 'images' | 'categories' | 'specifications'>) => {
    const filteredImages = images.filter((img) => img.trim() !== '');
    
    if (filteredImages.length === 0 && imageFiles.length === 0) {
      alert('At least one image is required');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('At least one category must be selected');
      return;
    }

    onSubmit({
      ...data,
      images: filteredImages,
      categories: selectedCategories,
      specifications,
      sizes: sizes.length > 0 ? sizes : undefined,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    const key = prompt('Enter specification name:');
    if (key && key.trim()) {
      setSpecifications({ ...specifications, [key.trim()]: '' });
    }
  };

  const updateSpecification = (key: string, value: string) => {
    setSpecifications({ ...specifications, [key]: value });
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-warmBrown mb-2">
          Product Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-4 py-2.5 border"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-warmBrown mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-4 py-2.5 border"
          placeholder="Describe your product..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-warmBrown mb-2">
            Price (INR ₹) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            id="price"
            className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-4 py-2.5 border"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-warmBrown mb-2">
            Stock Quantity *
          </label>
          <input
            {...register('stock', { valueAsNumber: true })}
            type="number"
            id="stock"
            className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-4 py-2.5 border"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Sizes Section */}
      <div>
        <label className="block text-sm font-medium text-warmBrown mb-2">
          Available Sizes (Optional)
        </label>
        <p className="text-xs text-taupe mb-3">
          Add sizes for clothing items (e.g., S, M, L, XL, XXL). Leave empty for products without sizes.
        </p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newSize.trim() && !sizes.includes(newSize.trim())) {
                  setSizes([...sizes, newSize.trim()]);
                  setNewSize('');
                }
              }
            }}
            className="flex-1 rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-4 py-2.5 border"
            placeholder="Enter size (e.g., S, M, L)"
          />
          <button
            type="button"
            onClick={() => {
              if (newSize.trim() && !sizes.includes(newSize.trim())) {
                setSizes([...sizes, newSize.trim()]);
                setNewSize('');
              }
            }}
            className="px-4 py-2.5 bg-warmBrown text-white rounded-lg hover:bg-taupe transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-sand text-warmBrown rounded-lg text-sm font-medium"
              >
                {size}
                <button
                  type="button"
                  onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                  className="text-terracotta hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-warmBrown mb-2">
          Primary Category *
        </label>
        <select
          {...register('category')}
          id="category"
          className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-3 py-2.5 border"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-warmBrown mb-3">
          Additional Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-terracotta text-white shadow-md'
                    : 'bg-sand text-warmBrown hover:bg-beige-200 border border-beige-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-taupe">
          Selected: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'None'}
        </p>
      </div>

      <div>
        <label htmlFor="collection" className="block text-sm font-medium text-warmBrown mb-2">
          Collection Tag
        </label>
        <select
          {...register('collection')}
          id="collection"
          className="mt-1 block w-full rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-3 py-2.5 border"
        >
          <option value="">No Collection</option>
          {COLLECTIONS.map((col) => (
            <option key={col.value} value={col.value}>
              {col.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-taupe">
          Tag this product for special collections like "New Arrival" or "Fresh Drop"
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-warmBrown mb-3">
          Product Images *
        </label>
        
        {/* Image Upload */}
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-beige-300 rounded-lg cursor-pointer bg-sand hover:bg-beige-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-taupe mb-2" />
              <p className="text-sm text-warmBrown font-medium">
                Click to upload images
              </p>
              <p className="text-xs text-taupe mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-beige-300 bg-sand">
                  {image ? (
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-taupe" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* URL Input Option */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-taupe">Or add image URLs:</p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="flex-1 rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-3 py-2 border"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    setImages([...images, input.value.trim()]);
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                if (input && input.value.trim()) {
                  setImages([...images, input.value.trim()]);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-sand text-warmBrown rounded-lg hover:bg-beige-200 transition-colors border border-beige-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-warmBrown mb-3">
          Specifications
        </label>
        <div className="space-y-3">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <input
                type="text"
                value={key}
                disabled
                className="w-1/3 rounded-lg border-beige-300 bg-sand shadow-sm sm:text-sm px-3 py-2 border text-taupe"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateSpecification(key, e.target.value)}
                placeholder="Value"
                className="flex-1 rounded-lg border-beige-300 shadow-sm focus:border-terracotta focus:ring-terracotta sm:text-sm px-3 py-2 border"
              />
              <button
                type="button"
                onClick={() => removeSpecification(key)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSpecification}
          className="mt-3 flex items-center gap-2 text-sm text-warmBrown hover:text-terracotta font-medium"
        >
          <Plus className="w-4 h-4" />
          Add specification
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-beige-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-semibold text-warmBrown bg-white border-2 border-warmBrown rounded-lg hover:bg-sand disabled:opacity-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-terracotta hover:bg-warmBrown disabled:opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};
