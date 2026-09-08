import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '../../types/product';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

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
  const [specifications] = useState<Record<string, string>>(
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
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      }
      return [...prev, cat];
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const updateImageField = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim().toUpperCase()]);
      setNewSize('');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 text-white">
      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Product Title *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="e.g. Heavyweight Cotton Oversized Tee"
          className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-neutral-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Description *
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          placeholder="Product fit, material details, care instructions..."
          className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors placeholder:text-neutral-600 resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-neutral-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Price (INR ₹) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="1"
            id="price"
            placeholder="e.g. 1999"
            className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-neutral-400">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Stock Units *
          </label>
          <input
            {...register('stock', { valueAsNumber: true })}
            type="number"
            id="stock"
            placeholder="e.g. 50"
            className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-neutral-400">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Primary Category *
        </label>
        <select
          {...register('category')}
          className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors"
        >
          <option value="" className="bg-black text-white">Select Primary Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-black text-white">
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-neutral-400">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Tags & Multi-Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.value);
            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 border border-white/15 text-neutral-400 active:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Available Sizes
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSize();
              }
            }}
            placeholder="e.g. S, M, L, XL, XXL"
            className="flex-1 max-w-xs rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-2.5 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black active:bg-neutral-200 transition-colors"
          >
            Add Size
          </button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {sizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 border border-white/20 text-white"
              >
                <span>{sz}</span>
                <button
                  type="button"
                  onClick={() => setSizes(sizes.filter((s) => s !== sz))}
                  className="text-neutral-400 active:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Collection Drop
        </label>
        <select
          {...register('collection')}
          className="w-full rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-3 outline-none focus:border-white transition-colors"
        >
          <option value="" className="bg-black text-white">No Collection Tag</option>
          {COLLECTIONS.map((col) => (
            <option key={col.value} value={col.value} className="bg-black text-white">
              {col.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
          Product Images (URLs or Upload)
        </label>
        <div className="space-y-2 mb-3">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => updateImageField(i, e.target.value)}
                placeholder="https://... image URL"
                className="flex-1 rounded-xl bg-black border border-white/15 text-white text-xs px-4 py-2.5 outline-none focus:border-white transition-colors placeholder:text-neutral-600"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-2.5 rounded-xl bg-neutral-900 border border-white/15 text-neutral-400 active:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addImageField}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white active:bg-neutral-800 transition-colors"
          >
            + Add URL Row
          </button>
          <label className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white active:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          {...register('isActive')}
          type="checkbox"
          id="isActive"
          className="w-4 h-4 accent-white rounded-sm cursor-pointer"
        />
        <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-neutral-300 cursor-pointer">
          Publish Product Live Immediately
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-black active:bg-neutral-200 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving Product...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-white/15 text-white active:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
