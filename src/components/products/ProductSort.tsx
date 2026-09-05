import { memo } from 'react';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface ProductSortProps {
  value: SortOption;
  onChange: (sortBy: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

export const ProductSort = memo(({ value, onChange }: ProductSortProps) => {
  return (
    <div className="flex items-center gap-2 select-none">
      <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-neutral-400 hidden sm:block">
        Sort:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-neutral-600 cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-neutral-950 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

ProductSort.displayName = 'ProductSort';
