import { useState } from 'react';
import { Product } from '../../types/product';
import { ProductImage } from '../common/ProductImage';
import { 
  Heart, 
  Share2, 
  RotateCcw, 
  Check, 
  X as CloseIcon, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number, size?: string) => void;
}

export const ProductDetail = ({ product, onAddToCart }: ProductDetailProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  
  const [openDetails, setOpenDetails] = useState(true);
  const [openDescription, setOpenDescription] = useState(true);
  const [openManufactured, setOpenManufactured] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 10);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const canAddToCart = !isOutOfStock && (!hasSizes || selectedSize);

  const handleAddToCart = async () => {
    if (!isOutOfStock && onAddToCart) {
      if (hasSizes && !selectedSize) {
        toast({
          title: 'Select Size',
          description: 'Please pick a size before adding to bag.',
          variant: 'destructive',
        });
        return;
      }

      setIsAddingToCart(true);
      try {
        await onAddToCart(product, quantity, selectedSize || undefined);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    toast({
      title: next ? 'Saved to Wishlist' : 'Removed from Wishlist',
      description: `${product.name} ${next ? 'added to' : 'removed from'} your wishlist.`,
    });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || !/^\d+$/.test(pincode.trim())) {
      setPincodeStatus('invalid');
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus('valid');
    }, 350);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${product.name} on B2C Streetwear`;

  const handleShare = (platform: 'whatsapp' | 'instagram' | 'x' | 'facebook' | 'copy') => {
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Product link copied for Instagram sharing.',
      });
      window.open('https://www.instagram.com', '_blank');
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Product link copied to clipboard.',
      });
    }
  };

  const productImages = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="bg-black text-white select-none">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
        <div className="w-full lg:w-[58%] flex flex-col gap-6">
          <div className="touch-manipulation">
            {productImages.length > 0 ? (
              <div className="relative aspect-[3/4] sm:aspect-square bg-black border border-neutral-900 overflow-hidden group">
                <ProductImage
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  aspectRatio="auto"
                />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-black/90 border border-neutral-800 text-[10px] font-mono font-bold tracking-[0.2em] text-white uppercase">
                    OFFICIAL B2C ARCHIVE
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-black/90 border border-neutral-800 text-[10px] font-mono font-medium tracking-[0.16em] text-neutral-300 uppercase">
                    HEAVYWEIGHT GSM
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-black border border-neutral-900 flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-wider">
                No Image Available
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[3/4] sm:aspect-square overflow-hidden border transition-all duration-200 bg-black ${
                    selectedImage === index
                      ? 'border-white opacity-100 ring-1 ring-white'
                      : 'border-neutral-900 opacity-60 hover:opacity-100 hover:border-neutral-700'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    loading="lazy"
                    aspectRatio="auto"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-1 right-1 px-1 bg-black/90 text-[8px] font-mono uppercase text-white">
                      FRONT
                    </span>
                  )}
                  {index === 1 && (
                    <span className="absolute bottom-1 right-1 px-1 bg-black/90 text-[8px] font-mono uppercase text-white">
                      BACK
                    </span>
                  )}
                  {index >= 2 && (
                    <span className="absolute bottom-1 right-1 px-1 bg-black/90 text-[8px] font-mono uppercase text-white">
                      DETAIL
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="mt-2 border border-neutral-900 bg-black">
            <div className="p-4 sm:p-5 border-b border-neutral-900 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
                  THE B2C ARCHIVE BENCHMARK
                </h2>
                <p className="text-[11px] font-mono text-neutral-500 uppercase mt-0.5">
                  Specification comparison vs standard retail
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
              <div className="p-5 bg-black">
                <div className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-neutral-400 mb-4 pb-2 border-b border-neutral-900">
                  Standard Streetwear
                </div>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug">
                    <span className="text-neutral-500 mt-0.5 text-xs">―</span>
                    <span>160-180 GSM standard cotton that loses structural shape</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug">
                    <span className="text-neutral-500 mt-0.5 text-xs">―</span>
                    <span>Single-stitched raw seams prone to unravelling</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug">
                    <span className="text-neutral-500 mt-0.5 text-xs">―</span>
                    <span>Batch testing with no individual piece inspection</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug">
                    <span className="text-neutral-500 mt-0.5 text-xs">―</span>
                    <span>Unwashed raw yarn with 8-12% post-wash shrinkage</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-400 leading-snug">
                    <span className="text-neutral-500 mt-0.5 text-xs">―</span>
                    <span>Basic chemical dyes that fade after several washes</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-black">
                <div className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-white mb-4 pb-2 border-b border-neutral-900">
                  B2C Archive Standard
                </div>
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5 text-xs text-neutral-200 leading-snug">
                    <span className="text-white mt-0.5 text-xs font-bold">✓</span>
                    <span className="font-medium text-white">240+ GSM custom-combed heavyweight French Terry</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-200 leading-snug">
                    <span className="text-white mt-0.5 text-xs font-bold">✓</span>
                    <span className="font-medium text-white">Reinforced high-tensile double-needle chain stitching</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-200 leading-snug">
                    <span className="text-white mt-0.5 text-xs font-bold">✓</span>
                    <span className="font-medium text-white">100% triple audit on each garment before dispatch</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-200 leading-snug">
                    <span className="text-white mt-0.5 text-xs font-bold">✓</span>
                    <span className="font-medium text-white">Pre-shrunk and bio-enzyme treated for enduring fit</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-200 leading-snug">
                    <span className="text-white mt-0.5 text-xs font-bold">✓</span>
                    <span className="font-medium text-white">Deep pitch-black reactive dyes with zero color loss</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-black border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="tracking-wide">RETENTION: 98.4% KEPT PIECES</span>
              <span className="text-white font-bold">4.96 / 5.0 RATED</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 flex flex-col space-y-5 bg-black border border-neutral-900 p-6 sm:p-7">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {product.category || 'Streetwear'}
              </span>
              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 border border-red-900/60 bg-red-950/20">
                  Out of Stock
                </span>
              ) : product.stock <= 10 ? (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 border border-amber-900/60 bg-amber-950/20">
                  Only {product.stock} Left
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 border border-emerald-900/60 bg-emerald-950/20">
                  In Stock
                </span>
              )}
            </div>

            <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="pb-4 border-b border-neutral-900">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Price incl. of all taxes
            </p>
          </div>

          {hasSizes && !isOutOfStock && (
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 font-medium">
                  Select Size
                </span>
                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                  Oversized Fit
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 px-3 text-xs font-mono font-semibold border transition-all duration-150 touch-manipulation uppercase ${
                      selectedSize === size
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-neutral-800 bg-black text-neutral-300 hover:border-neutral-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isOutOfStock && (
            <div>
              <span className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-2 font-medium">
                Quantity
              </span>
              <div className="inline-flex items-center border border-neutral-800 bg-black">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="w-12 h-10 flex items-center justify-center font-mono font-bold text-sm text-white border-x border-neutral-800">
                  {quantity.toString().padStart(2, '0')}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="w-10 h-10 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAddingToCart}
              className="flex-1 py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white bg-red-600 hover:bg-red-700 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:cursor-not-allowed transition-all duration-200 min-h-[50px] flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ADDING...</span>
                </>
              ) : isOutOfStock ? (
                'OUT OF STOCK'
              ) : (
                'ADD TO CART'
              )}
            </button>

            <button
              type="button"
              onClick={toggleWishlist}
              className="px-5 py-4 border border-neutral-800 bg-black hover:bg-neutral-900 hover:border-neutral-700 text-xs font-mono font-bold uppercase tracking-[0.14em] text-white transition-colors flex items-center justify-center gap-2"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="hidden sm:inline">WISHLIST</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs font-mono text-neutral-400">
            <span>Share:</span>
            
            <button
              type="button"
              onClick={() => handleShare('whatsapp')}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-black text-neutral-300 hover:text-[#25D366] hover:border-[#25D366]/60 flex items-center justify-center transition-colors"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.898-.787-3.123-2.73-3.218-2.856-.095-.126-.769-1.022-.769-1.95 0-.928.487-1.385.66-1.575.174-.19.38-.238.507-.238.127 0 .253.002.364.007.118.005.276-.045.431.328.16.386.549 1.34.598 1.439.049.099.082.215.016.345-.065.13-.098.212-.196.326-.098.115-.205.257-.294.345-.098.098-.201.205-.086.402.115.196.51 0.841 1.093 1.36.751.669 1.384.876 1.58.974.197.098.312.082.428-.05.115-.13.492-.573.623-.77.13-.197.262-.164.442-.098.18.065 1.146.54 1.343.639.197.098.328.147.377.23.049.082.049.475-.095.88z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.63 0-3.16-.46-4.47-1.26l-.32-.19-3.32.87.89-3.23-.21-.33A8.204 8.204 0 013.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleShare('instagram')}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-black text-neutral-300 hover:text-[#E4405F] hover:border-[#E4405F]/60 flex items-center justify-center transition-colors"
              aria-label="Share on Instagram"
              title="Share on Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleShare('x')}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-black text-neutral-300 hover:text-white hover:border-white/60 flex items-center justify-center transition-colors"
              aria-label="Share on X"
              title="Share on X"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-black text-neutral-300 hover:text-[#1877F2] hover:border-[#1877F2]/60 flex items-center justify-center transition-colors"
              aria-label="Share on Facebook"
              title="Share on Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleShare('copy')}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-black text-neutral-300 hover:text-white hover:border-neutral-600 flex items-center justify-center transition-colors"
              aria-label="Copy link"
              title="Copy link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-900">
            <span className="block text-xs font-mono uppercase tracking-[0.16em] text-neutral-300 mb-2 font-medium">
              Delivery Details
            </span>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setPincodeStatus(null);
                }}
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
                className="flex-1 bg-black border border-neutral-800 px-3 py-2.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white uppercase"
              />
              <button
                type="submit"
                disabled={isCheckingPincode}
                className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors"
              >
                {isCheckingPincode ? 'CHECKING...' : 'CHECK'}
              </button>
            </form>

            {pincodeStatus === 'valid' && (
              <p className="mt-2.5 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Express dispatch to {pincode} in 2-4 business days.</span>
              </p>
            )}
            {pincodeStatus === 'invalid' && (
              <p className="mt-2.5 text-xs font-mono text-red-400 flex items-center gap-1.5">
                <CloseIcon className="w-3.5 h-3.5" />
                <span>Please enter a valid 6-digit postal code.</span>
              </p>
            )}

            <div className="mt-3 p-3 bg-black border border-neutral-900 flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-neutral-400 leading-snug font-mono">
                This piece is eligible for exchange under our 30-day return policy. No questions asked.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-900 divide-y divide-neutral-900">
            <div>
              <button
                type="button"
                onClick={() => setOpenDetails(!openDetails)}
                className="w-full py-3.5 flex items-center justify-between text-left group"
              >
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-white font-medium group-hover:text-neutral-300">
                  Product Details & Specs
                </span>
                {openDetails ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>
              {openDetails && (
                <div className="pb-4 pt-1 space-y-2.5 text-xs text-neutral-300 font-mono">
                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-400">Fabric Weight</span>
                    <span className="text-white font-medium">240+ GSM Heavyweight</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-400">Material</span>
                    <span className="text-white font-medium">100% Combed French Terry Cotton</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-400">Fit</span>
                    <span className="text-white font-medium">Drop-Shoulder Boxy Streetwear</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-400">Country of Origin</span>
                    <span className="text-white font-medium">India (and proud)</span>
                  </div>
                  {product.specifications && Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-neutral-900 pb-1.5">
                      <span className="text-neutral-400 capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setOpenDescription(!openDescription)}
                className="w-full py-3.5 flex items-center justify-between text-left group"
              >
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-white font-medium group-hover:text-neutral-300">
                  Product Description
                </span>
                {openDescription ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>
              {openDescription && (
                <div className="pb-4 pt-1 text-xs text-neutral-300 leading-relaxed font-light">
                  {product.description || 'Authentic limited streetwear drop tailored with premium export-grade textiles, pre-shrunk finish, and reinforced comfort.'}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setOpenManufactured(!openManufactured)}
                className="w-full py-3.5 flex items-center justify-between text-left group"
              >
                <span className="text-xs font-mono uppercase tracking-[0.16em] text-white font-medium group-hover:text-neutral-300">
                  Manufactured & Sold By
                </span>
                {openManufactured ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>
              {openManufactured && (
                <div className="pb-4 pt-1 space-y-1 text-xs text-neutral-400 font-mono leading-relaxed">
                  <p className="text-white font-medium">B2C Streetwear Studio Pvt. Ltd.</p>
                  <p>24 Industrial Area, A.B. Road</p>
                  <p>Indore, Madhya Pradesh - 452001</p>
                  <p>support@b2cstreetwear.com · Care: +91 91111 22334</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
