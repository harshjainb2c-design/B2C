import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { ProductImage } from '../common/ProductImage';
import { 
  Heart, 
  Send,
  Check, 
  X as CloseIcon, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  MapPin,
  Ruler
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useWishlistStore } from '../../stores/wishlistStore';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number, size?: string) => void;
}

export const ProductDetail = ({ product, onAddToCart }: ProductDetailProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const isWishlisted = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [showPincodeInput, setShowPincodeInput] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [openSpecsSection, setOpenSpecsSection] = useState(true);
  const [openDetailsSection, setOpenDetailsSection] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'mfg'>('specs');

  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const isOutOfStock = product.stock === 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const canAddToCart = !isOutOfStock && (!hasSizes || selectedSize);

  const handleAddToCart = async () => {
    if (!isOutOfStock && onAddToCart) {
      if (hasSizes && !selectedSize) {
        toast({
          title: 'Select Size',
          description: 'Please select a size to proceed.',
          variant: 'destructive',
        });
        return;
      }

      setIsAddingToCart(true);
      try {
        await onAddToCart(product, 1, selectedSize || undefined);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (!isOutOfStock && onAddToCart) {
      if (hasSizes && !selectedSize) {
        toast({
          title: 'Select Size',
          description: 'Please select a size to proceed.',
          variant: 'destructive',
        });
        return;
      }

      setIsBuyingNow(true);
      try {
        await onAddToCart(product, 1, selectedSize || undefined);
        navigate('/checkout');
      } finally {
        setIsBuyingNow(false);
      }
    }
  };

  const toggleWishlist = () => {
    const added = toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      category: product.category,
    });
    toast({
      title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
      description: `${product.name} ${added ? 'added to' : 'removed from'} your wishlist.`,
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

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied',
      description: 'Product link copied to clipboard.',
    });
    if (typeof window !== 'undefined' && 'share' in navigator) {
      navigator.share?.({
        title: product.name,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    }
  };

  const scrollMobileTo = (index: number) => {
    setActiveMobileIndex(index);
    if (mobileCarouselRef.current) {
      const target = mobileCarouselRef.current.children[index] as HTMLElement;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handleMobileScroll = () => {
    if (mobileCarouselRef.current) {
      const scrollLeft = mobileCarouselRef.current.scrollLeft;
      const width = mobileCarouselRef.current.offsetWidth;
      if (width > 0) {
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex >= 0 && newIndex < productImages.length) {
          setActiveMobileIndex(newIndex);
        }
      }
    }
  };

  const productImages = product.images && product.images.length > 0 ? product.images : [];
  
  const productHighlights = [
    { label: 'Outer material', value: product.specifications?.['Outer Material'] || '100% Combed French Terry Cotton' },
    { label: 'Occasion', value: product.specifications?.['Occasion'] || 'Sports / Streetwear' },
    { label: 'Type For Casual', value: product.specifications?.['Type For Casual'] || 'Heavyweight Drop-Shoulder' },
    { label: 'Type For Sports', value: product.specifications?.['Type For Sports'] || 'Active Lifestyle Wear' },
  ];

  const generalSpecs = [
    { label: 'Brand', value: 'B2C' },
    { label: 'Brand Color', value: product.specifications?.['Brand Color'] || 'Onyx Black' },
    { label: 'Color', value: product.specifications?.['Color'] || 'Black' },
    { label: 'Outer material', value: product.specifications?.['Outer Material'] || '100% Combed French Terry Cotton' },
    { label: 'Model name', value: product.name },
    { label: 'Ideal for', value: 'Men & Women (Unisex)' },
    { label: 'Occasion', value: product.specifications?.['Occasion'] || 'Sports / Streetwear' },
    { label: 'Type For Casual', value: product.specifications?.['Type For Casual'] || 'Heavyweight Drop-Shoulder' },
    { label: 'Type For Sports', value: product.specifications?.['Type For Sports'] || 'Active Lifestyle Wear' },
    { label: 'Net Quantity', value: '1' },
  ];

  const productDetailSpecs = [
    { label: 'Size', value: selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'Standard (Oversized)') },
    { label: 'Fabric Weight', value: '240+ GSM High-Density Weave' },
    { label: 'Stitching', value: 'Reinforced Double-Needle Chain Stitching' },
    { label: 'Closure', value: 'Pull-Over / Drop-Shoulder' },
    { label: 'Weight', value: '380 g - 450 g (Weight may vary depending on size)' },
    { label: 'Pack of', value: '1' },
    { label: 'Article Number', value: `B2C-${product.id.slice(0, 8).toUpperCase()}` },
    { label: 'Care instructions', value: 'Clean with cold water or gentle machine wash inside out. Do not iron directly on print.' },
  ];

  const manufacturerInfo = [
    { label: 'Generic Name', value: product.category || 'Streetwear Apparel' },
    { label: 'Country of Origin', value: 'India' },
    { label: 'Name and address of the Manufacturer', value: 'B2C Streetwear Studio Pvt. Ltd., 24 Industrial Area, A.B. Road, Indore, Madhya Pradesh - 452001' },
    { label: 'Name and address of the Packer', value: 'B2C Streetwear Studio Pvt. Ltd., 24 Industrial Area, A.B. Road, Indore, Madhya Pradesh - 452001' },
    { label: 'Customer care details', value: 'support@b2cstreetwear.com · Care: +91 91111 22334' },
  ];

  return (
    <div className="bg-black text-white select-none font-inter pb-0 lg:pb-0">
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-6 lg:gap-12 items-start">
        <div className="w-full lg:w-[58.333%] flex flex-col gap-2 sm:gap-6 p-0 m-0">
          {productImages.length === 0 ? (
            <div className="aspect-[3/4] bg-neutral-950 rounded-none sm:rounded-2xl border-y sm:border border-white/10 flex items-center justify-center text-neutral-500 font-inter text-xs uppercase tracking-wider">
              No Image Available
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-2 gap-3.5 sm:gap-4">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewIndex(idx)}
                    className={`relative aspect-[3/4] bg-neutral-950 rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-white/30 transition-all duration-300 ${
                      productImages.length === 1 ? 'col-span-2 aspect-[4/5]' : ''
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      aspectRatio="auto"
                    />

                    {idx === 0 && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist();
                          }}
                          className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors"
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                          }}
                          className="w-9 h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors"
                          aria-label="Share"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {idx === 3 && productImages.length > 4 && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center text-white z-10">
                        <span className="text-xl font-bold font-inter tracking-wider">
                          +${productImages.length - 3}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                      <div className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:hidden flex flex-col gap-3 w-full p-0 m-0">
                <div 
                  ref={mobileCarouselRef}
                  onScroll={handleMobileScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full p-0 m-0"
                >
                  {productImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className="w-full shrink-0 snap-center aspect-[3/4] bg-neutral-950 rounded-none border-y border-white/10 overflow-hidden relative group"
                    >
                      <ProductImage
                        src={img}
                        alt={`${product.name} slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        aspectRatio="auto"
                      />

                      {idx === 0 && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist();
                            }}
                            className="w-8 h-8 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare();
                            }}
                            className="w-8 h-8 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                            aria-label="Share"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-sm rounded-full border border-white/15 text-[10px] font-inter font-bold tracking-wider text-white">
                          {idx + 1} / {productImages.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 sm:px-0 flex flex-col gap-1.5 pt-1">
                  {productImages.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {productImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => scrollMobileTo(idx)}
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            activeMobileIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {productImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => scrollMobileTo(idx)}
                          className={`relative w-16 h-20 shrink-0 rounded-xl overflow-hidden border transition-all duration-150 bg-neutral-950 ${
                            activeMobileIndex === idx ? 'border-white ring-1 ring-white opacity-100' : 'border-white/10 opacity-60'
                          }`}
                          aria-label={`Jump to image ${idx + 1}`}
                        >
                          <ProductImage
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            aspectRatio="auto"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-[41.666%] flex flex-col space-y-4 sm:space-y-5 bg-transparent px-4 sm:px-0 font-inter">
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="font-inter text-lg sm:text-2xl font-bold text-white leading-snug tracking-tight line-clamp-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-inter tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-neutral-400 font-normal">
                (Inclusive of all taxes)
              </span>
            </div>
          </div>

          {hasSizes && !isOutOfStock && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-inter font-bold uppercase tracking-wider text-neutral-200">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="inline-flex items-center gap-1 text-xs font-inter font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] h-[46px] px-3.5 rounded-xl text-xs font-inter font-bold border transition-all duration-150 touch-manipulation uppercase flex items-center justify-center ${
                      selectedSize === size
                        ? 'border-white bg-white text-black shadow-md'
                        : 'border-white/15 bg-neutral-900/90 text-neutral-300 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5 pt-1">
            <div className="text-xs font-inter font-bold uppercase tracking-wider text-neutral-200">
              Delivery details
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/60 overflow-hidden divide-y divide-white/10 font-inter">
              <div 
                onClick={() => setShowPincodeInput(!showPincodeInput)}
                className="p-3.5 bg-sky-500/[0.08] hover:bg-sky-500/[0.12] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path d="M9.08414 13.8688L8.68438 13.4214M6.91586 13.8688L7.31562 13.4214M12.4 6.75C12.4 8.16783 11.8481 9.50544 11.0906 10.6696C10.3343 11.832 9.39653 12.7851 8.68438 13.4214L9.4839 14.3162C10.2422 13.6387 11.2624 12.606 12.0964 11.3241C12.9292 10.0441 13.6 8.47922 13.6 6.75H12.4ZM11.1113 3.63873C11.9364 4.46389 12.4 5.58305 12.4 6.75H13.6C13.6 5.26479 13.01 3.84041 11.9598 2.7902L11.1113 3.63873ZM8 2.35C9.16695 2.35 10.2861 2.81357 11.1113 3.63873L11.9598 2.7902C10.9096 1.74 9.48521 1.15 8 1.15V2.35ZM4.88873 3.63873C5.71389 2.81357 6.83305 2.35 8 2.35V1.15C6.51479 1.15 5.09041 1.74 4.0402 2.7902L4.88873 3.63873ZM3.6 6.75C3.6 5.58305 4.06357 4.46389 4.88873 3.63873L4.0402 2.7902C2.99 3.84041 2.4 5.26479 2.4 6.75H3.6ZM7.31562 13.4214C6.60347 12.7851 5.66569 11.832 4.90943 10.6696C4.15193 9.50544 3.6 8.16783 3.6 6.75H2.4C2.4 8.47922 3.07077 10.0441 3.90359 11.3241C4.73765 12.606 5.75779 13.6387 6.5161 14.3162L7.31562 13.4214ZM8 13.8964C7.94117 13.8964 7.89717 13.887 7.81199 13.833C7.69818 13.7607 7.56373 13.643 7.31562 13.4214L6.5161 14.3162C6.93321 14.6889 7.34507 15.0964 8 15.0964V13.8964ZM8.68438 13.4214C8.43627 13.643 8.30182 13.7607 8.18801 13.833C8.10283 13.887 8.05883 13.8964 8 13.8964V15.0964C8.65493 15.0964 9.06679 14.6889 9.4839 14.3162L8.68438 13.4214ZM8 9.85C9.71208 9.85 11.1 8.46208 11.1 6.75H9.9C9.9 7.79934 9.04934 8.65 8 8.65V9.85ZM4.9 6.75C4.9 8.46208 6.28792 9.85 8 9.85V8.65C6.95066 8.65 6.1 7.79934 6.1 6.75H4.9ZM8 3.65C6.28792 3.65 4.9 5.03792 4.9 6.75H6.1C6.1 5.70066 6.95066 4.85 8 4.85V3.65ZM11.1 6.75C11.1 5.03792 9.71208 3.65 8 3.65V4.85C9.04934 4.85 9.9 5.70066 9.9 6.75H11.1Z" fill="#38bdf8"></path>
                  </svg>
                  <span className="text-xs text-neutral-200 truncate">
                    {pincodeStatus === 'valid' ? `Deliver to ${pincode}` : 'Check delivery availability'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-sky-400 font-semibold">
                    {pincodeStatus === 'valid' ? 'Change' : 'Check'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>

              {showPincodeInput && (
                <form onSubmit={handleCheckPincode} className="p-3 bg-neutral-950 flex items-center gap-2 border-b border-white/10">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setPincodeStatus(null);
                    }}
                    placeholder="Enter 6-digit Pincode"
                    maxLength={6}
                    className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none uppercase"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPincode}
                    className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold uppercase hover:bg-neutral-200 transition-colors"
                  >
                    {isCheckingPincode ? 'Checking...' : 'Check'}
                  </button>
                </form>
              )}

              {pincodeStatus === 'valid' && (
                <div className="p-3 bg-emerald-950/30 text-xs text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Delivery available for {pincode}.</span>
                </div>
              )}

              {pincodeStatus === 'invalid' && (
                <div className="p-3 bg-red-950/30 text-xs text-red-400 flex items-center gap-2">
                  <CloseIcon className="w-4 h-4 shrink-0" />
                  <span>Please enter a valid 6-digit postal code.</span>
                </div>
              )}

              <div className="p-3.5 bg-neutral-900/60 flex items-center gap-2 text-xs text-neutral-300">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M4.5 13.054v6.219c0 .192.079.378.22.514.14.136.33.213.53.213h13.5c.199 0 .39-.077.53-.213a.717.717 0 0 0 .22-.514v-6.219M5.063 4h13.875c.162.001.32.053.45.148s.225.228.271.38L21 9.09H3l1.34-4.564a.737.737 0 0 1 .272-.379.775.775 0 0 1 .45-.148v0Z" stroke="#a3a3a3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9 9.09v1.456c0 .771-.316 1.511-.879 2.056A3.048 3.048 0 0 1 6 13.455a3.048 3.048 0 0 1-2.121-.853A2.865 2.865 0 0 1 3 10.546V9.09M15 9.09v1.456c0 .771-.316 1.511-.879 2.056a3.048 3.048 0 0 1-2.121.853 3.048 3.048 0 0 1-2.121-.853A2.865 2.865 0 0 1 9 10.546V9.09M21 9.09v1.456c0 .771-.316 1.511-.879 2.056a3.048 3.048 0 0 1-2.122-.853A2.865 2.865 0 0 1 15 10.546V9.09" stroke="#a3a3a3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>Direct Dispatch from B2C Studio</span>
              </div>
            </div>
          </div>

          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 grid grid-cols-3 gap-2 py-3.5 my-1 border-y border-white/10 text-center font-inter">
            <div className="flex flex-col items-center justify-center py-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-1.5 shrink-0">
                <rect width="32" height="32" rx="8" fill="#f5f5f5" fillOpacity="0.08" />
                <path d="M17.6477 27.286C23.4199 27.286 28.0991 22.6068 28.0991 16.8346C28.0991 11.0624 23.4199 6.38318 17.6477 6.38318C11.8755 6.38318 7.19629 11.0624 7.19629 16.8346C7.19629 22.6068 11.8755 27.286 17.6477 27.286Z" fill="#38bdf8" fillOpacity="0.2" />
                <path d="M26.6586 15.2602C26.6586 9.48807 21.9794 4.80884 16.2072 4.80884C10.4351 4.80884 5.75586 9.48807 5.75586 15.2602C5.75586 21.0323 10.4351 25.7116 16.2072 25.7116C18.4529 25.7116 20.5332 25.0033 22.2369 23.7979" stroke="#e5e5e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26.9529 16.6703C26.8206 16.8995 26.7545 17.014 26.6552 17.014C26.556 17.014 26.4898 16.8995 26.3575 16.6703L25.0102 14.3367C24.8779 14.1075 24.8118 13.993 24.8614 13.907C24.911 13.8211 25.0433 13.8211 25.3079 13.8211L28.0025 13.8211C28.2671 13.8211 28.3994 13.8211 28.4491 13.907C28.4987 13.993 28.4325 14.1075 28.3002 14.3367L26.9529 16.6703Z" fill="#e5e5e5" />
                <g clipPath="url(#ReturnPeriod_a)">
                  <path d="M21.4395 11.8779L16.627 9.24467C16.4984 9.17362 16.3539 9.13635 16.207 9.13635C16.0601 9.13635 15.9156 9.17362 15.787 9.24467L10.9745 11.879C10.8371 11.9542 10.7224 12.0649 10.6423 12.1996C10.5623 12.3342 10.5199 12.4879 10.5195 12.6446V17.8749C10.5199 18.0316 10.5623 18.1853 10.6423 18.3199C10.7224 18.4546 10.8371 18.5653 10.9745 18.6405L15.787 21.2748C15.9156 21.3459 16.0601 21.3831 16.207 21.3831C16.3539 21.3831 16.4984 21.3459 16.627 21.2748L21.4395 18.6405C21.577 18.5653 21.6917 18.4546 21.7717 18.3199C21.8518 18.1853 21.8942 18.0316 21.8945 17.8749V12.6451C21.8945 12.4882 21.8522 12.3342 21.7721 12.1992C21.6921 12.0642 21.5772 11.9532 21.4395 11.8779ZM16.207 10.0103L20.6012 12.4165L18.9726 13.3074L14.5784 10.9012L16.207 10.0103ZM16.207 14.8228L11.8129 12.4165L13.6673 11.401L18.0615 13.8072L16.207 14.8228ZM21.0195 17.8771L16.6445 20.2719V15.5791L18.3945 14.6215V16.5728C18.3945 16.6888 18.4406 16.8001 18.5227 16.8822C18.6047 16.9642 18.716 17.0103 18.832 17.0103C18.9481 17.0103 19.0593 16.9642 19.1414 16.8822C19.2234 16.8001 19.2695 16.6888 19.2695 16.5728V14.1425L21.0195 13.1849V17.8749V17.8771Z" fill="#38bdf8" />
                </g>
                <line x1="8" y1="8" x2="24" y2="24" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <defs>
                  <clipPath id="ReturnPeriod_a">
                    <rect width="14" height="14" fill="white" transform="translate(9.20703 8.26025)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[11px] font-bold text-neutral-200 leading-tight">
                No<br />Return
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-1.5 shrink-0">
                <rect width="32" height="32" rx="8" fill="#f5f5f5" fillOpacity="0.08" />
                <rect x="5.80566" y="10.1655" width="23.2493" height="13.7773" rx="3" fill="#38bdf8" fillOpacity="0.2" />
                <path d="M27.333 19.2069V14.4434C27.333 11.6149 27.333 10.2007 26.4543 9.32204C25.5756 8.44336 24.1614 8.44336 21.333 8.44336H9.22266C6.39423 8.44336 4.98002 8.44336 4.10134 9.32204C3.22266 10.2007 3.22266 11.6149 3.22266 14.4434V16.2207C3.22266 19.0491 3.22266 20.4633 4.10134 21.342C4.98002 22.2207 6.39423 22.2207 9.22266 22.2207H20.0138H23.0276" stroke="#e5e5e5" strokeLinecap="round" />
                <path d="M12.8623 13.6385H18.3774" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.8623 11.5405H18.3774" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.4134 11.5405C15.0076 11.5405 15.5775 11.7766 15.9977 12.1968C16.4179 12.6169 16.6539 13.1868 16.6539 13.781C16.6539 14.3752 16.4179 14.9451 15.9977 15.3653C15.5775 15.7855 15.0076 16.0215 14.4134 16.0215H12.8623L16.6539 19.4684" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="6" y1="8" x2="26" y2="24" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-bold text-neutral-200 leading-tight">
                No Cash on<br />Delivery
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-1.5 shrink-0">
                <g clipPath="url(#CustomerSupport_a)">
                  <path d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0V0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16V16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32V32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16V16Z" fill="#f5f5f5" fillOpacity="0.08" />
                  <path d="M0 8C0 4.22876 0 2.34315 1.17157 1.17157C2.34315 0 4.22876 0 8 0H24C27.7712 0 29.6569 0 30.8284 1.17157C32 2.34315 32 4.22876 32 8V24C32 27.7712 32 29.6569 30.8284 30.8284C29.6569 32 27.7712 32 24 32H8C4.22876 32 2.34315 32 1.17157 30.8284C0 29.6569 0 27.7712 0 24V8Z" fill="#f5f5f5" fillOpacity="0.08" />
                  <path d="M15 25C19.4183 25 23 21.4183 23 17C23 12.5817 19.4183 9 15 9C10.5817 9 7 12.5817 7 17C7 21.4183 10.5817 25 15 25Z" fill="#38bdf8" fillOpacity="0.2" />
                  <path d="M7.56425 9.07804C11.3989 5.26416 17.6088 4.99169 21.7989 8.56199M22.9809 23.3641C19.4106 27.5541 13.2361 28.2707 8.84482 25.1137" stroke="#e5e5e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.03604 20L1.31729 18.2955L5.02468 15.6023C5.27184 15.4233 5.48491 15.2557 5.66389 15.0994C5.8457 14.9403 5.99201 14.777 6.10281 14.6094C6.2136 14.4418 6.28604 14.2557 6.32014 14.0511C6.35707 13.8267 6.34002 13.6349 6.269 13.4759C6.20082 13.3139 6.09002 13.1903 5.93661 13.1051C5.7832 13.0199 5.59854 12.9773 5.38264 12.9773C5.16389 12.9773 4.9636 13.0213 4.78178 13.1094C4.59996 13.1974 4.44798 13.3267 4.32582 13.4972C4.2065 13.6676 4.12695 13.875 4.08718 14.1193H1.83718C1.93945 13.5057 2.16531 12.9773 2.51474 12.5341C2.86701 12.0909 3.31303 11.75 3.85281 11.5114C4.39542 11.2727 5.00479 11.1534 5.68093 11.1534C6.37979 11.1534 6.96786 11.2656 7.44513 11.4901C7.92241 11.7116 8.26758 12.0241 8.48065 12.4276C8.69656 12.831 8.75763 13.304 8.66388 13.8466C8.60707 14.1818 8.48065 14.5142 8.28462 14.8438C8.09144 15.1733 7.78036 15.5398 7.35138 15.9432C6.92525 16.3438 6.33434 16.821 5.57866 17.375L4.64968 18.0568L4.64116 18.108H8.05025L7.73491 20H1.03604ZM8.74272 18.6364L9.04954 16.7955L13.4814 11.2727H15.1518L14.7427 13.7273H13.7882L11.4018 16.7273L11.3848 16.7955H16.5666L16.2598 18.6364H8.74272ZM12.7654 20L13.0893 18.0739L13.2768 17.2727L14.2654 11.2727H16.4814L15.0325 20H12.7654Z" fill="#38bdf8" />
                <path d="M22.764 20L27.3152 13.2159L27.3322 13.1648H23.3095L23.6163 11.2727H30.0936L29.7868 13.1648L25.2015 20H22.764Z" fill="#38bdf8" />
                  <g clipPath="url(#CustomerSupport_b)">
                    <path d="M22.25 13.75L17.75 18.25" stroke="#e5e5e5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22.25 18.25L17.75 13.75" stroke="#e5e5e5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
                <defs>
                  <clipPath id="CustomerSupport_a">
                    <path d="M0 16C0 8.45753 0 4.68629 2.34315 2.34315C4.68629 0 8.45753 0 16 0V0C23.5425 0 27.3137 0 29.6569 2.34315C32 4.68629 32 8.45753 32 16V16C32 23.5425 32 27.3137 29.6569 29.6569C27.3137 32 23.5425 32 16 32V32C8.45753 32 4.68629 32 2.34315 29.6569C0 27.3137 0 23.5425 0 16V16Z" fill="white" />
                  </clipPath>
                  <clipPath id="CustomerSupport_b">
                    <rect width="8" height="8" fill="white" transform="translate(16 12)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[11px] font-bold text-neutral-200 leading-tight">
                Customer<br />Support
              </span>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAddingToCart}
              className="h-[44px] px-6 rounded-[12px] text-[14px] leading-[18px] font-inter font-bold text-white bg-neutral-900 border border-white/20 hover:bg-neutral-800 hover:border-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canAddToCart || isBuyingNow}
              className="h-[44px] px-6 rounded-[12px] text-[14px] leading-[18px] font-inter font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md"
            >
              {isBuyingNow ? 'Processing...' : `Buy at ₹${product.price.toLocaleString('en-IN')}`}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 divide-y divide-white/10">
            <div>
              <button
                type="button"
                onClick={() => setOpenSpecsSection(!openSpecsSection)}
                className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-[14px] font-inter font-bold text-white group-hover:text-neutral-300">
                  Product highlights
                </span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${openSpecsSection ? 'rotate-180' : ''}`} />
              </button>

              <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openSpecsSection ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      {productHighlights.map((item) => (
                        <div key={item.label} className="border-b border-white/10 pb-2.5">
                          <div className="text-[12px] text-neutral-400 font-normal">{item.label}</div>
                          <div className="text-[13px] font-medium text-white mt-0.5 break-words">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setOpenDetailsSection(!openDetailsSection)}
                className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-[14px] font-inter font-bold text-white group-hover:text-neutral-300">
                  All details
                </span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${openDetailsSection ? 'rotate-180' : ''}`} />
              </button>

              <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openDetailsSection ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="pb-1 pt-1 space-y-3 font-inter">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('specs')}
                        className={`h-[34px] px-3.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                          activeTab === 'specs' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/10'
                        }`}
                      >
                        Specifications
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('desc')}
                        className={`h-[34px] px-3.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                          activeTab === 'desc' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/10'
                        }`}
                      >
                        Description
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('mfg')}
                        className={`h-[34px] px-3.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                          activeTab === 'mfg' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/10'
                        }`}
                      >
                        Manufacturer info
                      </button>
                    </div>

                    {activeTab === 'specs' && (
                      <div className="text-xs">
                        <div className="relative">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-2">
                              General
                            </div>
                            <div className="space-y-2">
                              {generalSpecs.slice(0, 4).map((item, idx) => (
                                <div
                                  key={item.label}
                                  className={`flex flex-col sm:flex-row sm:justify-between ${
                                    idx === 3 && !showMoreSpecs ? 'border-b-0 pb-1' : 'border-b border-white/10 pb-2'
                                  }`}
                                >
                                  <span className="text-[12px] text-neutral-400">{item.label}</span>
                                  <span className="text-[13px] font-medium text-white sm:text-right mt-0.5 sm:mt-0">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${showMoreSpecs ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                              <div className="space-y-2 pt-2">
                                {generalSpecs.slice(4).map((item) => (
                                  <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between border-b border-white/10 pb-2">
                                    <span className="text-[12px] text-neutral-400">{item.label}</span>
                                    <span className="text-[13px] font-medium text-white sm:text-right mt-0.5 sm:mt-0">{item.value}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-3">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-2">
                                  Product details
                                </div>
                                <div className="space-y-2">
                                  {productDetailSpecs.map((item, idx) => (
                                    <div
                                      key={item.label}
                                      className={`flex flex-col sm:flex-row sm:justify-between ${
                                        idx === productDetailSpecs.length - 1 ? 'border-b-0 pb-1' : 'border-b border-white/10 pb-2'
                                      }`}
                                    >
                                      <span className="text-[12px] text-neutral-400">{item.label}</span>
                                      <span className="text-[13px] font-medium text-white sm:text-right mt-0.5 sm:mt-0">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {!showMoreSpecs && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
                          )}
                        </div>

                        <div className={`flex justify-center relative z-10 ${showMoreSpecs ? 'pt-2' : '-mt-5'}`}>
                          <button
                            type="button"
                            onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                            className="py-1 text-xs font-bold text-white hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{showMoreSpecs ? 'See less' : 'See more'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreSpecs ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'desc' && (
                      <div className="text-xs text-neutral-300 leading-relaxed font-normal pt-1 pb-1">
                        {product.description || 'Experience all-day comfort with this lightweight, signature streetwear piece designed for everyday use. Tailored with premium heavyweight French Terry cotton, reinforced structural seams, and a relaxed drop-shoulder silhouette for an effortless, durable fit.'}
                      </div>
                    )}

                    {activeTab === 'mfg' && (
                      <div className="space-y-2 text-xs pb-1">
                        {manufacturerInfo.map((item) => (
                          <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between border-b border-white/10 pb-2">
                            <span className="text-[12px] text-neutral-400">{item.label}</span>
                            <span className="text-[13px] font-medium text-white sm:text-right mt-0.5 sm:mt-0">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md rounded-t-[16px] p-3 flex items-center gap-3 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart || isAddingToCart}
          className="flex-1 h-[44px] rounded-[12px] text-[14px] leading-[18px] font-inter font-bold text-white bg-neutral-900 border border-white/20 hover:bg-neutral-800 hover:border-white/35 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of stock' : 'Add to cart'}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canAddToCart || isBuyingNow}
          className="flex-1 h-[44px] rounded-[12px] text-[14px] leading-[18px] font-inter font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md"
        >
          {isBuyingNow ? 'Processing...' : `Buy at ₹${product.price.toLocaleString('en-IN')}`}
        </button>
      </div>

      {showSizeChart && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div 
            className="w-full max-w-lg bg-neutral-950 border border-white/20 rounded-2xl p-6 relative font-inter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-headline uppercase text-white tracking-wide">
                  Streetwear Size Guide
                </h3>
                <p className="text-xs text-neutral-400">
                  All measurements in inches (Oversized Boxy Fit)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-white"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/15 text-neutral-400 uppercase">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest</th>
                    <th className="py-2.5 px-3">Length</th>
                    <th className="py-2.5 px-3">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-neutral-200">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">S</td>
                    <td className="py-2.5 px-3">42"</td>
                    <td className="py-2.5 px-3">28.5"</td>
                    <td className="py-2.5 px-3">20.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">M</td>
                    <td className="py-2.5 px-3">44"</td>
                    <td className="py-2.5 px-3">29.5"</td>
                    <td className="py-2.5 px-3">21.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">L</td>
                    <td className="py-2.5 px-3">46"</td>
                    <td className="py-2.5 px-3">30.5"</td>
                    <td className="py-2.5 px-3">22.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">XL</td>
                    <td className="py-2.5 px-3">48"</td>
                    <td className="py-2.5 px-3">31.5"</td>
                    <td className="py-2.5 px-3">23.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">XXL</td>
                    <td className="py-2.5 px-3">50"</td>
                    <td className="py-2.5 px-3">32.5"</td>
                    <td className="py-2.5 px-3">24.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs text-neutral-400">
              <span className="text-white font-bold">Pro Tip:</span> If you prefer a regular fit rather than oversized, we recommend ordering one size down.
            </div>
          </div>
        </div>
      )}

      {previewIndex !== null && productImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-neutral-900/90 border border-white/20 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors z-50"
            aria-label="Close preview"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {productImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex - 1 + productImages.length) % productImages.length);
                }}
                className="absolute left-4 sm:left-6 w-11 h-11 rounded-full bg-neutral-900/90 border border-white/20 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex + 1) % productImages.length);
                }}
                className="absolute right-4 sm:right-6 w-11 h-11 rounded-full bg-neutral-900/90 border border-white/20 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div 
            className="relative max-h-[85vh] max-w-[85vw] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={productImages[previewIndex]}
              alt={`${product.name} preview`}
              className="max-h-[80vh] max-w-[85vw] object-contain rounded-xl border border-white/10"
            />
            <span className="mt-3 text-xs font-inter font-bold uppercase tracking-widest text-neutral-400">
              {previewIndex + 1} / {productImages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
