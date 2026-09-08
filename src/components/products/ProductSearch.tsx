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
          className="w-full bg-neutral-900/60 border border-white/15 rounded-full text-white placeholder:text-neutral-500 text-xs sm:text-sm pl-11 pr-24 py-2.5 focus:outline-none focus:border-white/40 font-inter"
        />
        
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
          <svg
            className="w-4 h-4"
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

        <button
          type="submit"
          className="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-400 p-1"
          title="Search"
          aria-label="Search"
        >
          <svg
            className="w-4 h-4"
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
        </button>

        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 p-1 text-xs font-inter font-bold"
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
