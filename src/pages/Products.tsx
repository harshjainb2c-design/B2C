import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import {
  ProductGrid,
  ProductFilters,
  ProductFiltersWrapper,
  ProductSearch,
  ProductSort,
  SortOption,
} from '../components/products';
import { ProductFiltersState } from '../components/products/ProductFilters';
import { RetryableQuery } from '../components/common/RetryableQuery';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Use URL as single source of truth - no local state
  const searchQuery = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') || 'newest') as SortOption;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  // Parse filters from URL
  const collection = searchParams.get('collection') || undefined;
  const filters: ProductFiltersState = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    gender: searchParams.get('gender') || undefined,
    clothingType: searchParams.get('clothingType') || undefined,
    itemType: searchParams.get('itemType') || undefined,
    priceRange: searchParams.get('priceRange') || undefined,
  }), [searchParams]);

  // Fetch products with filters
  // Map clothingType to category if no category is set
  const categoryFilter = filters.category || filters.clothingType;
  
  const { data, isLoading, error, refetch } = useProducts({
    category: categoryFilter,
    collection: collection,
    gender: filters.gender,
    itemType: filters.itemType,
    priceRange: filters.priceRange,
    search: searchQuery || undefined,
    sortBy,
    page: currentPage,
    limit: 12,
  });



  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== undefined).length;
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: ProductFiltersState) => {
    const params = new URLSearchParams();
    
    // Add all filters to URL
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.clothingType) params.set('clothingType', newFilters.clothingType);
    if (newFilters.itemType) params.set('itemType', newFilters.itemType);
    if (newFilters.priceRange) params.set('priceRange', newFilters.priceRange);
    
    // Preserve collection, search and sort
    const currentCollection = searchParams.get('collection');
    if (currentCollection) params.set('collection', currentCollection);
    const currentSearch = searchParams.get('search');
    if (currentSearch) params.set('search', currentSearch);
    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);
    
    // Reset to page 1 when filters change
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams();
    const currentCollection = searchParams.get('collection');
    if (currentCollection) params.set('collection', currentCollection);
    const currentCategory = searchParams.get('category');
    if (currentCategory) params.set('category', currentCategory);
    if (query) params.set('search', query);
    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);
    // Reset to page 1 when search changes
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSortChange = useCallback((newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    // Reset to page 1 when sort changes
    params.delete('page');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase">
            Shop Collection
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Discover the latest streetwear trends
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <ProductSearch 
            onSearch={handleSearch}
            initialValue={searchQuery}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFiltersWrapper activeFilterCount={activeFilterCount}>
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </ProductFiltersWrapper>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg">
                <RetryableQuery error={error} onRetry={() => refetch()} />
              </div>
            )}

            {/* Results Info and Sort */}
            {!isLoading && !error && data && (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-gray-900">{data.products?.length || 0}</span> of <span className="font-bold text-gray-900">{data.total}</span> products
                  {collection && (
                    <span className="ml-1">
                      in <span className="font-semibold text-gray-900 capitalize">{collection} Collection</span>
                    </span>
                  )}
                  {activeFilterCount > 0 && (
                    <span className="ml-1">
                      with <span className="font-semibold text-gray-900">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="ml-1">
                      matching <span className="font-semibold text-gray-900">"{searchQuery}"</span>
                    </span>
                  )}
                </p>
                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            )}

            {/* Products Grid */}
            {!error && (
              <ProductGrid
                products={data?.products || []}
                isLoading={isLoading}
              />
            )}

            {/* Pagination */}
            {!isLoading && data && data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === data.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-2 text-sm text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                          currentPage === page
                            ? 'text-white bg-gray-900 shadow-lg'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.totalPages}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
