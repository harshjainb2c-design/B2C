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
  
  const searchQuery = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') || 'newest') as SortOption;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const collection = searchParams.get('collection') || undefined;
  const filters: ProductFiltersState = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    gender: searchParams.get('gender') || undefined,
    clothingType: searchParams.get('clothingType') || undefined,
    itemType: searchParams.get('itemType') || undefined,
    priceRange: searchParams.get('priceRange') || undefined,
  }), [searchParams]);

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

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== undefined).length;
  }, [filters]);

  const quickCategories = [
    { id: 'all', label: 'All Products' },
    { id: 'upper', label: 'T-Shirts & Tops' },
    { id: 'bottom', label: 'Bottoms & Pants' },
    { id: 'shoes', label: 'Sneakers' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const handleQuickCategory = useCallback((catId: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
      params.delete('clothingType');
    }
    params.delete('page');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleFiltersChange = useCallback((newFilters: ProductFiltersState) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.clothingType) params.set('clothingType', newFilters.clothingType);
    if (newFilters.itemType) params.set('itemType', newFilters.itemType);
    if (newFilters.priceRange) params.set('priceRange', newFilters.priceRange);
    
    const currentCollection = searchParams.get('collection');
    if (currentCollection) params.set('collection', currentCollection);
    const currentSearch = searchParams.get('search');
    if (currentSearch) params.set('search', currentSearch);
    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);
    
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
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSortChange = useCallback((newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="mb-6 sm:mb-8 pb-6 border-b border-neutral-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-neutral-400 uppercase block mb-1">
                ARCHIVE // B2C 2026 DROPS
              </span>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none">
                SHOP COLLECTION
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-normal leading-relaxed">
              Explore heavyweight boxy cuts, custom streetwear tailored denim, and limited archive releases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4 sm:mb-6">
          {quickCategories.map((cat) => {
            const isActive = (!categoryFilter && cat.id === 'all') || categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleQuickCategory(cat.id === 'all' ? undefined : cat.id)}
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-md border border-white"
                    : "bg-transparent text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <ProductSearch 
            onSearch={handleSearch}
            initialValue={searchQuery}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProductFiltersWrapper activeFilterCount={activeFilterCount}>
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </ProductFiltersWrapper>
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="bg-neutral-950 border border-red-900/50 p-4 mb-6">
                <RetryableQuery error={error} onRetry={() => refetch()} />
              </div>
            )}

            {!isLoading && !error && data && (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-950 p-4 border border-neutral-900">
                <p className="text-xs sm:text-sm text-neutral-400">
                  Showing <span className="font-bold text-white">{data.products?.length || 0}</span> of <span className="font-bold text-white">{data.total}</span> products
                  {collection && (
                    <span className="ml-1">
                      in <span className="font-semibold text-white capitalize">{collection} Collection</span>
                    </span>
                  )}
                  {activeFilterCount > 0 && (
                    <span className="ml-1">
                      with <span className="font-semibold text-white">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="ml-1">
                      matching <span className="font-semibold text-white">"{searchQuery}"</span>
                    </span>
                  )}
                </p>
                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            )}

            {!error && (
              <ProductGrid
                products={data?.products || []}
                isLoading={isLoading}
              />
            )}

            {!isLoading && data && data.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-950 border border-neutral-800 hover:bg-white hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => {
                    const showPage =
                      page === 1 ||
                      page === data.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-2 text-xs text-neutral-600"
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
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`px-3.5 py-2 text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'text-black bg-white border border-white shadow-md'
                            : 'text-neutral-400 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.totalPages}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-950 border border-neutral-800 hover:bg-white hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
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
