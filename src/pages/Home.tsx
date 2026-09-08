import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Shield,
  Truck,
  ChevronRight,
  AlertCircle,
  Heart,
  Instagram,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";

export const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [selectedGenderCategory, setSelectedGenderCategory] = useState<"men" | "women" | "footwear">("men");

  const isItemWishlisted = (id: string) => wishlistItems.some((i) => i.id === id);

  const toggleWishlist = (
    id: string,
    name: string,
    price = 1299,
    image = "",
    category = "Apparel",
    fabric?: string
  ) => {
    const added = toggleWishlistItem({
      id,
      name,
      price,
      image,
      category,
      fabric,
    });
    toast({
      title: added ? "Added to Wishlist" : "Removed from Wishlist",
      description: `${name} ${added ? "added to" : "removed from"} your wishlist.`,
    });
  };

  const dropItems = [
    {
      id: "drop-1",
      name: "TIMELESS LINEN SHIRT - B2C 96",
      price: 1050,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&h=900&fit=crop&q=80",
    },
    {
      id: "drop-2",
      name: "VINTAGE CHECK SHIRT - B2C 96",
      price: 1099,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&h=900&fit=crop&q=80",
    },
    {
      id: "drop-3",
      name: "BONSAI OVERSIZED T-SHIRT - B2C 96",
      price: 950,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80",
    },
    {
      id: "drop-4",
      name: "BORN AGAIN OVERSIZED JERSEY - B2C 96",
      price: 950,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80",
    },
  ];

  const handleAddToCart = (item: (typeof dropItems)[0]) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.name,
        images: [item.image],
        category: "upper",
        stock: 50,
        isActive: true,
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      1
    );
    toast({
      title: "Added to Bag",
      description: `${item.name} has been added to your shopping bag.`,
    });
  };

  const [isMuted, setIsMuted] = useState(false);

  const reelsData = [
    {
      id: "Dazwp0XtfCd",
      image: "/reel-1.jpg",
      video: "/reels/reel-1.mp4",
      url: "https://www.instagram.com/reel/Dazwp0XtfCd/",
      title: "Store Walkthrough & Latest Drops",
    },
    {
      id: "DZj60Dzt2K9",
      image: "/reel-2.jpg",
      video: "/reels/reel-2.mp4",
      url: "https://www.instagram.com/reel/DZj60Dzt2K9/",
      title: "Heavyweight Boxy Tees Collection",
    },
    {
      id: "DZj6FJoNyX0",
      image: "/reel-3.jpg",
      video: "/reels/reel-3.mp4",
      url: "https://www.instagram.com/reel/DZj6FJoNyX0/",
      title: "Baggy Denim & Cargo Edit",
    },
    {
      id: "DYZNeuJNf00",
      image: "/reel-4.jpg",
      video: "/reels/reel-4.mp4",
      url: "https://www.instagram.com/reel/DYZNeuJNf00/",
      title: "Customer Styling & Fits",
    },
    {
      id: "DV3H7xVjeUl",
      image: "/reel-5.jpg",
      video: "/reels/reel-5.mp4",
      url: "https://www.instagram.com/reel/DV3H7xVjeUl/",
      title: "Wholesale & In-Store Vibe",
    },
  ];

  const reelsScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingReels = useRef(false);
  const startXReels = useRef(0);
  const scrollLeftReels = useRef(0);

  const onReelsMouseDown = (e: React.MouseEvent) => {
    if (!reelsScrollRef.current) return;
    isDraggingReels.current = true;
    startXReels.current = e.pageX - reelsScrollRef.current.offsetLeft;
    scrollLeftReels.current = reelsScrollRef.current.scrollLeft;
  };

  const onReelsMouseLeaveOrUp = () => {
    isDraggingReels.current = false;
  };

  const onReelsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingReels.current || !reelsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - reelsScrollRef.current.offsetLeft;
    const walk = (x - startXReels.current) * 1.5;
    reelsScrollRef.current.scrollLeft = scrollLeftReels.current - walk;
  };

  const [activeCatalogTab, setActiveCatalogTab] = useState("trending");
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeCatalogTab) return;
    setIsCatalogLoading(true);
    setActiveCatalogTab(tabId);
    setTimeout(() => {
      setIsCatalogLoading(false);
    }, 450);
  };

  const catalogTabs = [
    { id: "trending", label: "Trending" },
    { id: "oversized", label: "Oversized T-Shirts" },
    { id: "shirts", label: "Shirts" },
    { id: "polos", label: "Classic Polos" },
    { id: "pants", label: "Men Pants" },
    { id: "jeans", label: "Men Jeans" },
    { id: "joggers", label: "Men Joggers" },
    { id: "collectibles", label: "Collectibles" },
  ];

  const trustFeatures = [
    { icon: TrendingUp, title: "Wholesale Prices", subtitle: "Best rates in Indore" },
    { icon: Truck, title: "Local Delivery", subtitle: "Fast delivery in Indore" },
    { icon: Shield, title: "Secure Payment", subtitle: "100% secure" },
    { icon: ShoppingBag, title: "Easy Returns", subtitle: "30-day policy" },
  ];

  const genderCategoryTabs = [
    { id: "men", label: "MEN" },
    { id: "women", label: "WOMEN" },
    { id: "footwear", label: "FOOTWEAR" },
  ];

  const genderCategoryData: Record<
    "men" | "women" | "footwear",
    Array<{ id: string; name: string; image: string; path: string; position?: string }>
  > = {
    men: [
      {
        id: "m-tshirts",
        name: "T-SHIRTS",
        image: "/tshirt-men.png",
        path: "/products?category=t-shirts",
      },
      {
        id: "m-shirts",
        name: "SHIRTS",
        image: "/shirt-men.png",
        path: "/products?category=shirts",
      },
      {
        id: "m-polos",
        name: "POLOS",
        image: "/polo-men.png",
        path: "/products?category=polos",
      },
      {
        id: "m-jeans",
        name: "JEANS",
        image: "/jeans-men.png?v=3",
        path: "/products?category=jeans",
        position: "object-bottom",
      },
      {
        id: "m-pants",
        name: "PANTS",
        image: "/pants-men.png?v=1",
        path: "/products?category=pants",
        position: "object-bottom",
      },
      {
        id: "m-joggers",
        name: "JOGGERS",
        image: "/joggers-men.png?v=1",
        path: "/products?category=joggers",
        position: "object-bottom",
      },
    ],
    women: [
      {
        id: "w-tshirts",
        name: "T-SHIRTS",
        image: "/tshirt-women.png?v=1",
        path: "/products?category=t-shirts",
        position: "object-top",
      },
      {
        id: "w-crop-tops",
        name: "CROP TOPS",
        image: "/croptop-women.png?v=1",
        path: "/products?category=crop-tops",
        position: "object-top",
      },
      {
        id: "w-shirts",
        name: "SHIRTS",
        image: "/shirt-women.png?v=1",
        path: "/products?category=shirts",
        position: "object-top",
      },
      {
        id: "w-jeans",
        name: "JEANS",
        image: "/jeans-women.png?v=1",
        path: "/products?category=jeans",
        position: "object-bottom",
      },
      {
        id: "w-pants",
        name: "PANTS",
        image: "/pants-women.png?v=1",
        path: "/products?category=pants",
        position: "object-bottom",
      },
      {
        id: "w-hoodies",
        name: "HOODIES",
        image: "/hoodie-women.jpg?v=1",
        path: "/products?category=hoodies",
      },
    ],
    footwear: [
      {
        id: "f-sneakers",
        name: "SNEAKERS",
        image: "/sneakers.png?v=1",
        path: "/products?category=footwear",
      },
      {
        id: "f-high-tops",
        name: "HIGH TOPS",
        image: "/hightops.jpg?v=1",
        path: "/products?category=footwear",
      },
      {
        id: "f-chunky",
        name: "CHUNKY SNEAKERS",
        image: "/chunky-sneakers.jpg?v=1",
        path: "/products?category=footwear",
      },
      {
        id: "f-clogs",
        name: "CLOGS",
        image: "/clogs.jpg?v=1",
        path: "/products?category=footwear",
      },
      {
        id: "f-loafers",
        name: "LOAFERS",
        image: "/loafers.jpg?v=1",
        path: "/products?category=footwear",
      },
      {
        id: "f-boots",
        name: "BOOTS",
        image: "/boots.png?v=1",
        path: "/products?category=footwear",
        position: "object-bottom",
      },
    ],
  };

  const catalogProducts: Record<
    string,
    Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      image: string;
      fit: string;
      fabric: string;
    }>
  > = {
    trending: [
      {
        id: "tr-1",
        name: "Dragon Ball Z: Kaio-Ken X3",
        category: "Super Oversized T-Shirts",
        price: 1599,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM INTERLOCK FABRIC",
      },
      {
        id: "tr-2",
        name: "Spider-Man: Rise Of The Spider",
        category: "Oversized T-Shirts",
        price: 1599,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM HEAVY GAUGE FABRIC",
      },
      {
        id: "tr-3",
        name: "Cars: Lightning McQueen 95",
        category: "Oversized Jerseys",
        price: 1199,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM DOT KNIT FABRIC",
      },
      {
        id: "tr-4",
        name: "Spider-Man: Mutation X",
        category: "Vests",
        price: 1199,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM HEAVY GAUGE FABRIC",
      },
      {
        id: "tr-5",
        name: "Ronin Cyberpunk Drop-Shoulder Tee",
        category: "Super Oversized T-Shirts",
        price: 1499,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "280 GSM COMBED COTTON",
      },
      {
        id: "tr-6",
        name: "Hogwarts Legacy Crest Tee",
        category: "Oversized T-Shirts",
        price: 1399,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM FRENCH TERRY",
      },
      {
        id: "tr-7",
        name: "Midnight Tokyo Drift Jersey",
        category: "Oversized Jerseys",
        price: 1699,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "BREATHABLE SPORT KNIT",
      },
      {
        id: "tr-8",
        name: "Acid Wash Heavy Baggy Jeans",
        category: "Wide Leg Denim",
        price: 1999,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&h=900&fit=crop&q=80",
        fit: "BAGGY FIT",
        fabric: "14.5 OZ RIGID DENIM",
      },
    ],
    oversized: [
      {
        id: "ov-1",
        name: "Dragon Ball Z: Kaio-Ken X3",
        category: "Super Oversized T-Shirts",
        price: 1599,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM INTERLOCK FABRIC",
      },
      {
        id: "ov-2",
        name: "Spider-Man: Rise Of The Spider",
        category: "Oversized T-Shirts",
        price: 1599,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM HEAVY GAUGE FABRIC",
      },
      {
        id: "ov-3",
        name: "Ronin Cyberpunk Drop-Shoulder Tee",
        category: "Super Oversized T-Shirts",
        price: 1499,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "280 GSM COMBED COTTON",
      },
      {
        id: "ov-4",
        name: "Hogwarts Legacy Crest Tee",
        category: "Oversized T-Shirts",
        price: 1399,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "PREMIUM FRENCH TERRY",
      },
      {
        id: "ov-5",
        name: "Bonsai Zen Heavyweight Boxy Tee",
        category: "Super Oversized T-Shirts",
        price: 950,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "260 GSM COTTON",
      },
      {
        id: "ov-6",
        name: "Born Again Graphic Tee - B2C 96",
        category: "Oversized T-Shirts",
        price: 950,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "HEAVY GAUGE KNIT",
      },
      {
        id: "ov-7",
        name: "Akira Neo-Tokyo Heavyweight Tee",
        category: "Super Oversized T-Shirts",
        price: 1499,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "VINTAGE WASH COTTON",
      },
      {
        id: "ov-8",
        name: "Gothic Typography Boxy Cut Tee",
        category: "Oversized T-Shirts",
        price: 1299,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "ORGANIC COMBED COTTON",
      },
    ],
    shirts: [
      {
        id: "sh-1",
        name: "Cuban Collar Relaxed Linen Shirt",
        category: "Casual Shirts",
        price: 1499,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&h=900&fit=crop&q=80",
        fit: "RELAXED FIT",
        fabric: "60% LINEN 40% COTTON",
      },
      {
        id: "sh-2",
        name: "Bowling Boxy Camp Shirt - Monogram",
        category: "Camp Collar Shirts",
        price: 1699,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80",
        fit: "BOXY FIT",
        fabric: "RAYON BLEND TEXTURE",
      },
      {
        id: "sh-3",
        name: "Raw Edge Oversized Overshirt",
        category: "Heavy Overshirts",
        price: 2199,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "HEAVY TWILL FABRIC",
      },
      {
        id: "sh-4",
        name: "Minimalist Utility Workwear Shirt",
        category: "Workwear Shirts",
        price: 1899,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&h=900&fit=crop&q=80",
        fit: "RELAXED FIT",
        fabric: "BRUSHED CANVAS",
      },
      {
        id: "sh-5",
        name: "Checkerboard Knit Resort Shirt",
        category: "Knit Shirts",
        price: 1799,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&h=900&fit=crop&q=80",
        fit: "REGULAR BOXY",
        fabric: "OPEN WEAVE KNIT",
      },
      {
        id: "sh-6",
        name: "Shadow Stripe Lightweight Shirt",
        category: "Casual Shirts",
        price: 1599,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&h=900&fit=crop&q=80",
        fit: "RELAXED FIT",
        fabric: "100% VISCOSE",
      },
      {
        id: "sh-7",
        name: "Acid Wash Denim Short Sleeve Shirt",
        category: "Denim Shirts",
        price: 1899,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&h=900&fit=crop&q=80",
        fit: "BOXY FIT",
        fabric: "LIGHT DENIM 7 OZ",
      },
      {
        id: "sh-8",
        name: "Flannel Plaid Oversized Shacket",
        category: "Flannel Shirts",
        price: 1999,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&h=900&fit=crop&q=80",
        fit: "OVERSIZED FIT",
        fabric: "HEAVY FLANNEL WOOL",
      },
    ],
    jeans: [
      {
        id: "jn-1",
        name: "Acid Wash Heavy Baggy Jeans",
        category: "Wide Leg Denim",
        price: 1999,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&h=900&fit=crop&q=80",
        fit: "BAGGY FIT",
        fabric: "14.5 OZ RIGID DENIM",
      },
      {
        id: "jn-2",
        name: "Vintage Charcoal Skater Denim",
        category: "Skater Fit Jeans",
        price: 2199,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&h=900&fit=crop&q=80",
        fit: "ULTRA WIDE",
        fabric: "HEAVYWEIGHT DENIM",
      },
      {
        id: "jn-3",
        name: "Carpenter Raw Indigo Jeans",
        category: "Carpenter Denim",
        price: 2299,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&h=900&fit=crop&q=80",
        fit: "RELAXED STRAIGHT",
        fabric: "RAW SELVEDGE DENIM",
      },
      {
        id: "jn-4",
        name: "Distressed Knee Slash Baggy Jeans",
        category: "Distressed Denim",
        price: 2399,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&h=900&fit=crop&q=80",
        fit: "BAGGY FIT",
        fabric: "WASHED COTTON DENIM",
      },
      {
        id: "jn-5",
        name: "Double Knee Utility Denim Pants",
        category: "Workwear Denim",
        price: 2499,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&h=900&fit=crop&q=80",
        fit: "RELAXED FIT",
        fabric: "REINFORCED TWILL",
      },
      {
        id: "jn-6",
        name: "Stack Flare Mud Wash Jeans",
        category: "Stack Fit Denim",
        price: 2299,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&h=900&fit=crop&q=80",
        fit: "FLARE FIT",
        fabric: "13.5 OZ RINGSPUN",
      },
      {
        id: "jn-7",
        name: "Bleach Splatter Baggy Jeans",
        category: "Artisanal Denim",
        price: 2199,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&h=900&fit=crop&q=80",
        fit: "BAGGY FIT",
        fabric: "100% COTTON DENIM",
      },
      {
        id: "jn-8",
        name: "Overdyed Jet Black Baggy Jeans",
        category: "Jet Black Denim",
        price: 1999,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&h=900&fit=crop&q=80",
        fit: "WIDE LEG",
        fabric: "DEEP DYE BLACK DENIM",
      },
    ],
  };

  const currentProducts = catalogProducts[activeCatalogTab] || catalogProducts.trending;

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative bg-black w-full overflow-hidden min-h-[70vh] lg:h-[calc(100vh-5rem)] lg:max-h-[900px] flex items-center border-b border-neutral-900">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 lg:py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-5 text-left z-10 flex flex-col items-start justify-center py-4 lg:py-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-neutral-300 uppercase">
                  SEASON 2026 // DROP 01
                </span>
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white uppercase leading-[0.92] tracking-tight mb-3 sm:mb-4 select-none">
                DISRUPT THE NORM<br />
                <span className="text-neutral-400">B2C EXPORTS 01</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 tracking-[0.16em] uppercase font-semibold mb-6 sm:mb-7">
                Heavyweight Baggy Denim & Curated Kicks. Limited Quantities.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-black text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] px-6 sm:px-7 py-3 sm:py-3.5 hover:bg-neutral-200 transition-all duration-300 shadow-xl group"
                >
                  SHOP COLLECTION
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-transparent text-white border border-neutral-700 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-6 sm:px-7 py-3 sm:py-3.5 transition-all duration-300"
                >
                  VIEW ARCHIVE
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full flex items-center justify-center lg:justify-end overflow-hidden">
                <img
                  src="/hero-spotlight.jpg?v=2"
                  alt="B2C Exports Streetwear Drop"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-auto max-h-[500px] sm:max-h-[620px] lg:max-h-[calc(100vh-6.5rem)] xl:max-h-[calc(100vh-6rem)] object-contain lg:object-right select-none"
                />
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black to-transparent pointer-events-none hidden lg:block" />
                <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full overflow-hidden bg-[#181818] border-y border-neutral-800 py-2.5 sm:py-3 select-none">
        <div className="animate-marquee flex items-center">
          <div className="flex items-center shrink-0">
            {[
              "LIMITED EDITION",
              "NEW ARRIVAL",
              "NEW ARRIVAL",
              "LIMITED EDITION",
              "NEW ARRIVAL",
              "NEW ARRIVAL",
              "LIMITED EDITION",
              "NEW ARRIVAL",
            ].map((text, idx) => (
              <div
                key={`mq-a-${idx}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-neutral-300 uppercase whitespace-nowrap"
              >
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 stroke-[2.2]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center shrink-0">
            {[
              "LIMITED EDITION",
              "NEW ARRIVAL",
              "NEW ARRIVAL",
              "LIMITED EDITION",
              "NEW ARRIVAL",
              "NEW ARRIVAL",
              "LIMITED EDITION",
              "NEW ARRIVAL",
            ].map((text, idx) => (
              <div
                key={`mq-b-${idx}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-neutral-300 uppercase whitespace-nowrap"
              >
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 stroke-[2.2]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-black text-white py-10 sm:py-14 md:py-16 border-b border-neutral-900">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            <div className="lg:w-[24%] shrink-0 flex flex-col justify-between py-1">
              <div>
                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-3 select-none">
                  DROP 01
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-xs mb-6">
                  Curated streetwear archive. Heavyweight custom cuts and export silhouettes. Finite inventory, no restocks.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 border border-neutral-700 text-white text-xs font-bold uppercase tracking-[0.18em] px-5 py-3 w-fit"
              >
                EXPLORE DROP 01
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex overflow-x-auto scrollbar-hide pb-3 sm:pb-0 sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-2 snap-x snap-mandatory">
                {dropItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/products`)}
                    className="shrink-0 w-[185px] xs:w-[210px] sm:w-auto snap-start group relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center select-none"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id, item.name, item.price, item.image, "Drop Item");
                      }}
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full text-white/90 hover:text-red-500 transition-all z-10 outline-none focus:outline-none focus:ring-0 active:outline-none"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                          isItemWishlisted(item.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white hover:text-red-400"
                        }`}
                      />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 pt-12 sm:pt-16 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-headline text-xs sm:text-sm tracking-wide text-white uppercase line-clamp-2 leading-snug mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                          Rs. {item.price.toLocaleString("en-IN")}.00
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="p-1 sm:p-1.5 text-white/80 hover:text-white hover:scale-110 transition-transform shrink-0"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="shrink-0 w-2 sm:hidden" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-0 border-b border-neutral-900 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-0 sm:px-0 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <div className="lg:col-span-4 text-left flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-0">
              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white uppercase leading-[0.95] tracking-tight mb-4 select-none">
                THE HOUSE OF<br />
                B2C EXPORTS
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-normal leading-relaxed max-w-md mb-6 sm:mb-8">
                Signature 280 GSM heavyweight boxy tees, drop-shoulder tailoring, and relaxed baggy denim engineered for everyday streetwear culture.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 border border-neutral-700 text-white text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-6 sm:px-8 py-3.5 transition-all w-fit"
              >
                SHOP COLLECTION
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-8 relative overflow-hidden">
              <img
                src="/house-of-b2c.jpg?v=4"
                alt="B2C Streetwear Duo"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover object-center select-none block"
              />
              <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-10 sm:py-14 md:py-16 border-b border-neutral-900 overflow-hidden select-none">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-5 sm:mb-7">
            <div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-2">
                B2C COMMUNITY
              </h2>
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.22em] text-neutral-400 uppercase">
                TRUSTED BY 6K+
              </p>
            </div>
            <a
              href="https://www.instagram.com/b2cexports_since_2018/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 px-4 py-2.5 bg-neutral-950 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@b2cexports_since_2018</span>
            </a>
          </div>

          <div className="relative">
            <div
              ref={reelsScrollRef}
              onMouseDown={onReelsMouseDown}
              onMouseLeave={onReelsMouseLeaveOrUp}
              onMouseUp={onReelsMouseLeaveOrUp}
              onMouseMove={onReelsMouseMove}
              className="flex gap-2.5 sm:gap-3.5 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 cursor-grab active:cursor-grabbing -mr-4 sm:-mr-6 lg:-mr-8 pr-4 sm:pr-6 lg:pr-8"
            >
              {reelsData.map((reel) => (
                <div
                  key={reel.id}
                  className="relative shrink-0 w-[220px] sm:w-[260px] md:w-[300px] aspect-[9/16] overflow-hidden bg-neutral-900 border border-neutral-800 block select-none"
                >
                  {activeReelId === reel.id ? (
                    <div className="relative w-full h-full bg-black">
                      <video
                        src={reel.video}
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-black/75 hover:bg-black text-white shadow-xl backdrop-blur-sm transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReelId(null);
                          }}
                          className="p-1.5 sm:p-2 rounded-full bg-black/75 hover:bg-black text-white shadow-xl backdrop-blur-sm transition-colors"
                          aria-label="Close reel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Playing Now</span>
                        </span>
                        <p className="text-xs font-medium text-white line-clamp-1">
                          {reel.title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveReelId(reel.id)}
                      className="relative w-full h-full cursor-pointer"
                    >
                      <img
                        src={reel.image}
                        alt={reel.title}
                        className="w-full h-full object-cover object-center select-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20 pointer-events-none" />

                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-white/95 bg-black/45 backdrop-blur-sm flex items-center justify-center text-white shadow-2xl">
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono font-bold tracking-wider text-neutral-300 uppercase mb-1">
                          <Instagram className="w-2.5 h-2.5 text-pink-500" />
                          <span>Watch Reel</span>
                        </span>
                        <p className="text-xs font-medium text-neutral-200 line-clamp-1">
                          {reel.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 sm:hidden flex justify-center">
            <a
              href="https://www.instagram.com/b2cexports_since_2018/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 px-5 py-2.5 bg-neutral-950 transition-colors w-full"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@b2cexports_since_2018</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-10 md:py-12 bg-black text-white border-b border-neutral-900 overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {trustFeatures.map((item, idx) => (
            <div key={idx} className="text-center">
              <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1">
                {item.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-neutral-400">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        <div className="sm:hidden relative w-full overflow-hidden select-none py-1">
          <div className="animate-marquee flex items-center">
            <div className="flex items-center shrink-0">
              {[...trustFeatures, ...trustFeatures].map((item, idx) => (
                <div
                  key={`trust-a-${idx}`}
                  className="inline-flex items-center gap-2.5 px-4 shrink-0"
                >
                  <item.icon className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div className="text-left whitespace-nowrap">
                    <h3 className="text-xs font-semibold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-tight">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="text-neutral-700 text-xs ml-3 select-none">/</span>
                </div>
              ))}
            </div>
            <div className="flex items-center shrink-0">
              {[...trustFeatures, ...trustFeatures].map((item, idx) => (
                <div
                  key={`trust-b-${idx}`}
                  className="inline-flex items-center gap-2.5 px-4 shrink-0"
                >
                  <item.icon className="w-4 h-4 text-neutral-400 shrink-0" />
                  <div className="text-left whitespace-nowrap">
                    <h3 className="text-xs font-semibold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 leading-tight">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="text-neutral-700 text-xs ml-3 select-none">/</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-16 border-b border-neutral-900 select-none overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start lg:justify-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-6 sm:pb-8 -mr-4 sm:-mr-6 lg:mr-0 pr-4 sm:pr-6 lg:pr-0">
            {catalogTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeCatalogTab === tab.id
                    ? "bg-white text-black font-bold shadow-md border border-white"
                    : "bg-transparent text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {isCatalogLoading
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col bg-transparent animate-pulse">
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm">
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-neutral-800 rounded-full" />
                      <div className="absolute bottom-2.5 left-0 w-24 h-3.5 bg-neutral-800" />
                    </div>
                    <div className="pt-3 pb-2 px-1 text-left space-y-1.5">
                      <div className="h-3.5 bg-neutral-800 rounded w-4/5" />
                      <div className="h-2.5 bg-neutral-800/70 rounded w-1/2" />
                      <div className="h-3.5 bg-neutral-800 rounded w-1/3 pt-0.5" />
                    </div>
                  </div>
                ))
              : currentProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate("/products")}
                    className="group cursor-pointer flex flex-col bg-transparent"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center select-none"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id, item.name, item.price, item.image, item.category, item.fabric);
                        }}
                        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 hover:text-red-500 transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            isItemWishlisted(item.id) ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>
                      <div className="absolute bottom-2.5 left-0 z-10">
                        <span className="px-2.5 py-0.5 bg-black/85 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-white uppercase">
                          {item.fabric}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 pb-2 px-1 text-left">
                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 mb-0.5">
                        {item.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-white/90 font-normal mb-1.5">
                        {item.category}
                      </p>
                      <span className="text-xs sm:text-sm font-extrabold text-white">
                        ₹ {item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-black text-white border-t border-neutral-900 select-none overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5 sm:mb-8">
            <p className="text-[11px] sm:text-xs font-extrabold tracking-[0.22em] text-neutral-400 uppercase mb-1.5 sm:mb-2">
              CURATED WARDROBE
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-none mb-3 sm:mb-5">
              SHOP BY CATEGORY
            </h2>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full max-w-sm sm:max-w-md mx-auto">
              {genderCategoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedGenderCategory(tab.id as "men" | "women" | "footwear")}
                  className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                    selectedGenderCategory === tab.id
                      ? "bg-white text-black shadow-md border border-white"
                      : "bg-transparent text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-3.5 lg:gap-4">
            {genderCategoryData[selectedGenderCategory].map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(cat.path)}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-full aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-full h-full object-cover select-none ${cat.position || "object-center"}`}
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs tracking-[0.12em] uppercase text-neutral-200 text-center mt-1.5 sm:mt-2 line-clamp-1">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14 sm:py-18 md:py-24 bg-black text-white overflow-hidden border-t border-neutral-900 select-none">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950 mb-4 sm:mb-6">
            <Instagram className="w-4 h-4 text-pink-500" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-neutral-300 uppercase">
              @b2cexports_since_2018
            </span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.05] mb-3 sm:mb-4">
            FOLLOW US ON INSTAGRAM
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed mb-6 sm:mb-8">
            Join 6,000+ streetwear enthusiasts in Indore. Catch exclusive first looks, flash restocks, and daily styling edits.
          </p>

          <a
            href="https://www.instagram.com/b2cexports_since_2018/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-10 py-2.5 sm:py-4 text-[11px] sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all rounded-sm uppercase tracking-wide sm:tracking-wider whitespace-nowrap max-w-full"
          >
            <Instagram className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black shrink-0" />
            <span>FOLLOW @B2CEXPORTS_SINCE_2018</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </a>
        </div>
      </section>
    </div>
  );
};
