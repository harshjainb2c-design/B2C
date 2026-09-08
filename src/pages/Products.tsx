import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteProducts } from '../hooks/useProducts';
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
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const observerTargetRef = useRef<HTMLDivElement>(null);
  
  const searchQuery = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') || 'newest') as SortOption;
  
  const collection = searchParams.get('collection') || undefined;
  const filters: ProductFiltersState = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    gender: searchParams.get('gender') || undefined,
    clothingType: searchParams.get('clothingType') || undefined,
    itemType: searchParams.get('itemType') || undefined,
    priceRange: searchParams.get('priceRange') || undefined,
  }), [searchParams]);

  const categoryFilter = filters.category || filters.clothingType;
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteProducts({
    category: categoryFilter,
    collection: collection,
    gender: filters.gender,
    itemType: filters.itemType,
    priceRange: filters.priceRange,
    search: searchQuery || undefined,
    sortBy,
    limit: 12,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || [];
  }, [data]);

  const isFetchingRef = useRef(isFetchingNextPage);
  isFetchingRef.current = isFetchingNextPage;

  const hasNextPageRef = useRef(hasNextPage);
  hasNextPageRef.current = hasNextPage;

  const handleFetchNext = useCallback(() => {
    if (hasNextPageRef.current && !isFetchingRef.current) {
      fetchNextPage();
    }
  }, [fetchNextPage]);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleFetchNext();
        }
      },
      { threshold: 0, rootMargin: '600px' }
    );

    observer.observe(target);

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 700) {
        handleFetchNext();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleFetchNext]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v !== undefined).length;
  }, [filters]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (collection) return `${collection.toUpperCase()}`;
    if (filters.category === 'upper' || filters.clothingType === 'upper') return 'T-SHIRTS & TOPS';
    if (filters.category === 'bottom' || filters.clothingType === 'bottom') return 'BOTTOMS & PANTS';
    if (filters.category === 'shoes' || filters.clothingType === 'shoes') return 'SNEAKERS & FOOTWEAR';
    if (filters.category === 'accessories' || filters.clothingType === 'accessories') return 'ACCESSORIES';
    if (categoryFilter) return `${categoryFilter.toUpperCase()}`;
    return 'ALL PRODUCTS';
  }, [searchQuery, collection, filters, categoryFilter]);

  const pageSubtitle = useMemo(() => {
    if (searchQuery) return `Showing curated results for "${searchQuery}"`;
    if (collection) return `Exclusive pieces from the ${collection.toLowerCase()} drop.`;
    if (filters.category === 'upper' || filters.clothingType === 'upper') return 'Heavyweight tees, structured overshirts, and signature hoodies.';
    if (filters.category === 'bottom' || filters.clothingType === 'bottom') return 'Relaxed cargos, raw denim, and tapered utility bottoms.';
    if (filters.category === 'shoes' || filters.clothingType === 'shoes') return 'Limited-run sneakers and everyday footwear staples.';
    if (filters.category === 'accessories' || filters.clothingType === 'accessories') return 'Essential headwear, leather accessories, and everyday carry.';
    return 'Explore handcrafted streetwear silhouettes, premium fabrics, and limited releases.';
  }, [searchQuery, collection, filters]);

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
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-clip select-none font-inter">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        <div className="mb-4 sm:mb-8 pb-3 sm:pb-5 border-b-0 sm:border-b sm:border-neutral-900">
          <div>
            {collection && (
              <span className="text-[10px] sm:text-xs font-inter font-bold tracking-[0.22em] text-neutral-400 uppercase block mb-1">
                COLLECTION · {collection.toUpperCase()}
              </span>
            )}
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-inter mt-2.5 max-w-xl leading-relaxed">
              {pageSubtitle}
            </p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <ProductSearch 
            onSearch={handleSearch}
            initialValue={searchQuery}
          />
        </div>

        <div className="flex lg:hidden items-center justify-between gap-3 mb-5">
          <ProductFiltersWrapper activeFilterCount={activeFilterCount}>
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </ProductFiltersWrapper>
          <ProductSort value={sortBy} onChange={handleSortChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide pr-1">
            <ProductFiltersWrapper activeFilterCount={activeFilterCount}>
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </ProductFiltersWrapper>
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="rounded-2xl bg-neutral-950/60 border border-red-900/50 p-4 mb-6">
                <RetryableQuery error={error} onRetry={() => refetch()} />
              </div>
            )}

            {!isLoading && !error && allProducts.length > 0 && (
              <div className="hidden lg:flex items-center justify-between pb-3 mb-5 border-b border-white/10">
                <div>
                  {(collection || activeFilterCount > 0 || searchQuery) ? (
                    <p className="text-xs sm:text-sm text-neutral-400">
                      {collection && (
                        <span>
                          <span className="font-semibold text-white capitalize">{collection}</span> Collection
                        </span>
                      )}
                      {activeFilterCount > 0 && (
                        <span className="ml-1">
                          • <span className="font-semibold text-white">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>
                        </span>
                      )}
                      {searchQuery && (
                        <span className="ml-1">
                          • <span className="font-semibold text-white">"{searchQuery}"</span>
                        </span>
                      )}
                    </p>
                  ) : <div />}
                </div>
                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            )}

            {!error && (
              <div>
                <ProductGrid
                  products={allProducts}
                  isLoading={isLoading}
                />

                {isFetchingNextPage && (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div ref={observerTargetRef} className="h-10 w-full pointer-events-none" />

            {!isLoading && !hasNextPage && allProducts.length > 0 && (
              <div className="py-12 text-center border-t border-white/10 mt-8">
                <p className="text-xs font-inter font-medium tracking-wider text-neutral-500 uppercase">
                  You have viewed all products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
