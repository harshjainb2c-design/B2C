import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ProductFiltersState {
  category?: string;
  gender?: string;
  clothingType?: string;
  itemType?: string;
  priceRange?: string;
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
}

export const ProductFilters = ({
  filters,
  onFiltersChange,
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    gender: true,
    clothingType: true,
    itemType: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const priceRanges = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: '₹2000 - ₹5000', value: '2000-5000' },
    { label: 'Over ₹5000', value: '5000-999999' },
  ];

  const genders = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
  ];

  const clothingTypes = [
    { label: 'Upper Wear', value: 'upper' },
    { label: 'Bottom Wear', value: 'bottom' },
    { label: 'Footwear', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const itemTypes = [
    { label: 'T-Shirts', value: 'tshirt' },
    { label: 'Shirts', value: 'shirt' },
    { label: 'Hoodies', value: 'hoodie' },
    { label: 'Jackets', value: 'jacket' },
    { label: 'Jeans', value: 'jeans' },
    { label: 'Pants', value: 'pants' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'Boots', value: 'boots' },
    { label: 'Sandals', value: 'sandals' },
  ];

  const handleFilterChange = (key: keyof ProductFiltersState, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    options, 
    selectedValue, 
    onChange 
  }: { 
    title: string;
    sectionKey: keyof typeof expandedSections;
    options: { label: string; value: string }[];
    selectedValue?: string;
    onChange: (value: string | undefined) => void;
  }) => (
    <div className="border-b border-neutral-900 pb-3">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 text-left group"
      >
        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wide group-hover:text-white transition-colors">{title}</h4>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-2 space-y-1.5">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer py-1 group">
              <input
                type="checkbox"
                checked={selectedValue === option.value}
                onChange={(e) => onChange(e.target.checked ? option.value : undefined)}
                className="w-3.5 h-3.5 accent-white bg-neutral-900 border-neutral-700 cursor-pointer rounded-none"
              />
              <span className={`ml-2 text-xs transition-colors ${selectedValue === option.value ? 'font-bold text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="lg:border lg:border-neutral-900 bg-neutral-950 lg:p-4 text-white select-none">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-900">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Price Range"
          sectionKey="price"
          options={priceRanges}
          selectedValue={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />

        <FilterSection
          title="Gender"
          sectionKey="gender"
          options={genders}
          selectedValue={filters.gender}
          onChange={(value) => handleFilterChange('gender', value)}
        />

        <FilterSection
          title="Clothing Type"
          sectionKey="clothingType"
          options={clothingTypes}
          selectedValue={filters.clothingType}
          onChange={(value) => handleFilterChange('clothingType', value)}
        />

        <FilterSection
          title="Item Type"
          sectionKey="itemType"
          options={itemTypes}
          selectedValue={filters.itemType}
          onChange={(value) => handleFilterChange('itemType', value)}
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="mt-4 w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 border border-neutral-800 hover:bg-white hover:text-black transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
