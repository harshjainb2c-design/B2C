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
        className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-inter font-bold uppercase tracking-wider text-white bg-black border border-neutral-800 hover:border-neutral-700 select-none"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 rounded-full text-[10px] font-inter font-bold text-black bg-white flex items-center justify-center leading-none">
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

          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-neutral-950 border-r border-white/10 text-white z-50 lg:hidden overflow-y-auto font-inter">
            <div className="sticky top-0 bg-neutral-950 border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-sm font-inter font-bold uppercase tracking-wider text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-neutral-400"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {children}
            </div>

            <div className="sticky bottom-0 bg-neutral-950 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full py-3 px-6 rounded-full text-xs font-inter font-bold uppercase tracking-wider text-black bg-white border border-white"
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
