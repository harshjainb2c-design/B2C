import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../hooks/use-toast';

export const Wishlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addCartItem = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleRemove = (item: WishlistItem) => {
    removeItem(item.id);
    toast({
      title: 'Removed from Wishlist',
      description: item.name + ' has been removed.',
    });
  };

  const handleMoveToCart = (item: WishlistItem) => {
    addCartItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        images: [item.image],
        description: item.name,
        category: item.category || 'streetwear',
        stock: 10,
        isActive: true,
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      1,
      'M'
    );
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
    toast({
      title: 'Added to Cart',
      description: item.name + ' (Size M) added to your cart.',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 sm:pt-10 pb-16 sm:pb-24 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-5 sm:pb-8 mb-8 sm:mb-12">
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
              Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 tracking-wide">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearWishlist();
                toast({
                  title: 'Wishlist Cleared',
                  description: 'All saved items have been removed.',
                });
              }}
              className="text-xs text-neutral-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center mb-6 text-neutral-500">
              <Heart className="w-9 h-9 stroke-[1.5]" />
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl text-white uppercase tracking-tight mb-3">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
              Curate your personal collection. Save items you love and revisit them anytime.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-sm bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              <span>EXPLORE DROPS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-transparent select-none relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800 rounded-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center cursor-pointer"
                    onClick={() => navigate('/products/' + item.id)}
                    loading="lazy"
                  />

                  {item.fabric && (
                    <div className="absolute bottom-2.5 left-0 z-10 pointer-events-none">
                      <span className="px-2.5 py-0.5 bg-black/85 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-white uppercase">
                        {item.fabric}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white hover:text-red-400 border border-neutral-800 flex items-center justify-center transition-all shadow-md"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="pt-3 pb-2 px-1 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => navigate('/products/' + item.id)}
                      className="cursor-pointer text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 hover:text-neutral-300 transition-colors mb-1"
                    >
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-normal uppercase tracking-wider mb-2">
                      {item.category || 'Apparel'}
                    </p>
                    <span className="text-xs sm:text-sm font-extrabold text-white block mb-3">
                      ₹ {item.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all border ${addedIds.has(item.id) ? 'bg-white text-black border-white' : 'bg-neutral-900 text-white border-neutral-800'}`}
                  >
                    {addedIds.has(item.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
