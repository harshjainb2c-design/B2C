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

  // Close drawer when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when drawer is open
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
      {/* Mobile Toggle Button - Only visible on mobile/tablet */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs font-medium text-white bg-gray-900 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block">
        {children}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4">
              {children}
            </div>

            {/* Apply Filters Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleApplyFilters}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
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
