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
    <div className="border-b border-white/10 pb-3.5">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-1.5 text-left"
      >
        <h4 className="text-xs font-inter font-bold text-neutral-300 uppercase tracking-wide">{title}</h4>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-2 space-y-1.5">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={selectedValue === option.value}
                onChange={(e) => onChange(e.target.checked ? option.value : undefined)}
                className="w-3.5 h-3.5 accent-white bg-neutral-900 border-white/20 cursor-pointer rounded-sm"
              />
              <span className={`ml-2 text-xs font-inter ${selectedValue === option.value ? 'font-bold text-white' : 'text-neutral-400'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="text-white select-none font-inter">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <h3 className="text-xs font-inter font-extrabold text-white uppercase tracking-wider">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-inter text-neutral-400 underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3.5">
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
          className="mt-5 mb-4 w-full px-4 py-2.5 text-xs font-inter font-bold uppercase tracking-wider text-neutral-300 rounded-lg border border-white/15 bg-transparent hover:border-white hover:text-white transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
