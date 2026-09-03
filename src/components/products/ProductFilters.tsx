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
    <div className="border-b border-gray-200 pb-2">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-1.5 text-left"
      >
        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{title}</h4>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-2 space-y-1">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer py-1">
              <input
                type="checkbox"
                checked={selectedValue === option.value}
                onChange={(e) => onChange(e.target.checked ? option.value : undefined)}
                className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer rounded"
              />
              <span className={`ml-2 text-xs ${selectedValue === option.value ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="lg:border lg:border-gray-200 lg:p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          sectionKey="price"
          options={priceRanges}
          selectedValue={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />

        {/* Gender Filter */}
        <FilterSection
          title="Gender"
          sectionKey="gender"
          options={genders}
          selectedValue={filters.gender}
          onChange={(value) => handleFilterChange('gender', value)}
        />

        {/* Clothing Type Filter */}
        <FilterSection
          title="Clothing Type"
          sectionKey="clothingType"
          options={clothingTypes}
          selectedValue={filters.clothingType}
          onChange={(value) => handleFilterChange('clothingType', value)}
        />

        {/* Item Type Filter */}
        <FilterSection
          title="Item Type"
          sectionKey="itemType"
          options={itemTypes}
          selectedValue={filters.itemType}
          onChange={(value) => handleFilterChange('itemType', value)}
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="mt-4 w-full px-3 py-2 text-xs font-medium text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
