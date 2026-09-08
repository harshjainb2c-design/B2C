import { useState } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  initialValue?: string;
}

export const ProductSearch = ({
  onSearch,
  placeholder = 'Search products...',
  initialValue = '',
}: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full select-none font-inter">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 text-sm sm:text-base pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 focus:outline-none focus:ring-0 focus:border-neutral-600 font-inter"
        />
        
        <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 text-xs sm:text-sm font-inter font-bold"
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
};
