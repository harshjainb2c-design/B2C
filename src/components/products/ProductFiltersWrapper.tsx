import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface ProductFiltersWrapperProps {
  children: React.ReactNode;
  activeFilterCount: number;
}

export const ProductFiltersWrapper = ({
  children,
  activeFilterCount,
}: ProductFiltersWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors select-none"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs font-bold text-black bg-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className="hidden lg:block">
        {children}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-neutral-950 border-r border-neutral-900 text-white z-50 lg:hidden overflow-y-auto">
            <div className="sticky top-0 bg-neutral-950 border-b border-neutral-900 px-4 py-4 flex items-center justify-between z-10">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {children}
            </div>

            <div className="sticky bottom-0 bg-neutral-950 border-t border-neutral-900 p-4">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
