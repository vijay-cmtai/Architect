import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
  X,
} from "lucide-react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg";
import DisplayPrice from "@/components/DisplayPrice";

// --- HELPER FUNCTIONS ---
const slugify = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- VIDEO MODAL ---
const VideoModal = ({
  videoId,
  onClose,
}: {
  videoId: string | null;
  onClose: () => void;
}) => {
  if (!videoId) return null;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, controls: 1 },
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 z-10"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const HomeFloorPlans = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { products, listStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  // Fetch only Floor Plans
  useEffect(() => {
    dispatch(
      fetchProducts({ planCategory: "floor-plans", limit: 8, sortBy: "newest" })
    );
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) dispatch(fetchMyOrders());
  }, [dispatch, userInfo]);

  const purchasedProductIds = useMemo(() => {
    if (!userInfo || !Array.isArray(orders)) return new Set();
    const paidItems = orders
      .filter((order) => order.isPaid)
      .flatMap((order) => order.orderItems);
    return new Set(
      paidItems.map((item) => item.productId?._id || item.productId)
    );
  }, [orders, userInfo]);

  const processedData = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    // Filter locally to be safe if API returns mixed
    const floorPlansOnly = products.filter((p) => {
      const cat = String(p.category || p.Categories).toLowerCase();
      return cat.includes("floor") || cat.includes("house plan");
    });

    return floorPlansOnly.slice(0, 8).map((product) => {
      const productName = product.name || product.Name || "Untitled Plan";
      const regularPrice =
        Number(product.price) || Number(product["Regular price"]) || 0;
      const salePrice =
        Number(product.salePrice) || Number(product["Sale price"]) || 0;
      const isSale = salePrice > 0 && salePrice < regularPrice;

      return {
        ...product,
        id: product._id,
        displayName: productName,
        slug: `${slugify(productName)}-${product._id}`,
        mainImage:
          product.mainImage ||
          product.image ||
          product.Images?.split(",")[0]?.trim() ||
          house3,
        plotAreaDisplay:
          product.plotArea || String(product["Attribute 2 value(s)"] || "N/A"),
        roomsDisplay:
          product.rooms || String(product["Attribute 3 value(s)"] || "N/A"),
        plotSizeDisplay:
          product.plotSize || String(product["Attribute 1 value(s)"] || "N/A"),
        directionDisplay:
          product.direction || String(product["Attribute 4 value(s)"] || "N/A"),
        categoryDisplay:
          (Array.isArray(product.category) && product.category[0]) ||
          product.Categories?.split(",")[0] ||
          "Floor Plan",
        isSale,
        displayPrice: isSale ? salePrice : regularPrice,
        regularPrice,
        videoId: getYouTubeId(product.youtubeLink),
        isWishlisted: isInWishlist(product._id),
        hasPurchased: purchasedProductIds.has(product._id),
      };
    });
  }, [products, purchasedProductIds, isInWishlist]);

  const handleWishlistToggle = (product: any) => {
    if (!userInfo)
      return toast({
        variant: "destructive",
        title: "Please Login",
        description: "Login to manage wishlist.",
      });
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist!" });
    }
  };

  const handleDownload = (product: any) => {
    if (!product.hasPurchased)
      return toast({ variant: "destructive", title: "Purchase Required" });
    const files = product.planFile || [];
    if (files.length === 0)
      return toast({ variant: "destructive", title: "No Files Found" });
    files.forEach((url: string) => window.open(url, "_blank"));
    toast({ title: "Download Started" });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (listStatus === "loading")
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  if (processedData.length === 0) return null;

  return (
    <section className="py-12 bg-background border-b">
      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Latest Floor Plans
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore our newest residential layouts
            </p>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-6 md:gap-8">
              {processedData.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-card rounded-2xl overflow-hidden group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[320px] snap-start"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative border-b bg-muted/20">
                    <Link to={`/product/${product.slug}`} className="block p-4">
                      <img
                        src={product.mainImage}
                        alt={product.displayName}
                        className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
                      />
                    </Link>
                    {product.isSale && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                        Sale!
                      </div>
                    )}
                    {product.hasPurchased && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                        Purchased
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${product.isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={product.isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                      {product.videoId && (
                        <button
                          onClick={() => setPlayingVideoId(product.videoId)}
                          className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                        >
                          <Youtube className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SAME 4-GRID LAYOUT */}
                  <div className="p-4 border-b">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gray-50 rounded-md p-2">
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.plotAreaDisplay}
                        </p>
                      </div>
                      <div className="bg-teal-50 rounded-md p-2">
                        <p className="text-xs text-gray-500">BHK</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.roomsDisplay}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-md p-2">
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.plotSizeDisplay}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-md p-2">
                        <p className="text-xs text-gray-500">Facing</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.directionDisplay || "Any"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        {product.categoryDisplay}
                      </p>
                      <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                        {product.displayName}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                        {product.isSale && (
                          <span className="text-sm text-gray-400 line-through">
                            <DisplayPrice inrPrice={product.regularPrice} />
                          </span>
                        )}
                        <span className="text-xl font-bold text-gray-900">
                          <DisplayPrice inrPrice={product.displayPrice} />
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/product/${product.slug}`}>
                        <Button
                          size="sm"
                          className="w-full bg-slate-800 text-white hover:bg-slate-700 text-sm h-10"
                        >
                          Read more
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className={`w-full text-white text-sm h-10`}
                        onClick={() => handleDownload(product)}
                        disabled={!product.hasPurchased}
                      >
                        {product.hasPurchased ? (
                          <>
                            <Download className="mr-2 h-4 w-4" /> PDF
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" /> Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/browse-plans">
            <Button variant="outline" className="w-full">
              View All Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFloorPlans;
