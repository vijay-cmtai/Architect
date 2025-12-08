import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
  X,
} from "lucide-react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg";
import DisplayPrice from "@/components/DisplayPrice";
// ✅ Import Currency Context
import { useCurrency } from "@/contexts/CurrencyContext";

// ✅ Import Actions
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";

// --- HELPER FUNCTIONS ---
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- VIDEO MODAL ---
const VideoModal = ({ videoId, onClose }) => {
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
const HomeElevations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Currency Hook
  const { symbol, rate } = useCurrency();

  // Redux Selectors
  const { products: adminProducts, listStatus: adminStatus } = useSelector(
    (state) => state.products
  );
  const { plans: professionalPlans, listStatus: profStatus } = useSelector(
    (state) => state.professionalPlans
  );
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  // --- FETCH DATA (Logic for Elevations) ---
  useEffect(() => {
    const params = {
      limit: 12,
      sortBy: "newest",
      planCategory: "elevations", // ✅ Fetching 3D Elevations
    };

    dispatch(fetchProducts(params));
    dispatch(fetchAllApprovedPlans(params));

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

  // --- MERGE & PROCESS DATA ---
  const processedData = useMemo(() => {
    // 1. Merge Lists
    const combinedList = [
      ...(Array.isArray(adminProducts) ? adminProducts : []),
      ...(Array.isArray(professionalPlans) ? professionalPlans : []),
    ];

    if (combinedList.length === 0) return [];

    // 2. Map Data
    return combinedList.slice(0, 10).map((product) => {
      const productName =
        product.name || product.planName || product.Name || "Untitled Plan";

      // Price Logic
      const regularPrice =
        product.price && product.price > 0
          ? product.price
          : product["Regular price"] &&
              parseFloat(String(product["Regular price"])) > 0
            ? parseFloat(String(product["Regular price"]))
            : 0;

      const salePrice =
        product.salePrice && product.salePrice > 0
          ? product.salePrice
          : product["Sale price"] &&
              parseFloat(String(product["Sale price"])) > 0
            ? parseFloat(String(product["Sale price"]))
            : null;

      const isSale =
        salePrice !== null &&
        salePrice > 0 &&
        regularPrice > 0 &&
        salePrice < regularPrice;

      const displayPrice = isSale ? salePrice : regularPrice;

      // Image Logic
      const getImageSource = () => {
        const primaryImage =
          product.mainImage || product.image || product.Images;
        if (primaryImage && typeof primaryImage === "string") {
          return primaryImage.split(",")[0].trim();
        }
        return house3;
      };

      // City Logic
      const city = product.city
        ? Array.isArray(product.city)
          ? product.city.join(", ")
          : product.city
        : null;

      return {
        ...product,
        id: product._id,
        displayName: productName,
        slug: `${slugify(productName)}-${product._id}`,
        mainImage: getImageSource(),

        // --- ATTRIBUTES (Matching ThreeDPlansPage Grid) ---
        // 1. Area
        plotAreaDisplay:
          product.plotArea ||
          (product["Attribute 2 value(s)"]
            ? parseInt(
                String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, "")
              )
            : "N/A"),

        // 2. Rooms
        roomsDisplay: product.rooms || product["Attribute 3 value(s)"] || "N/A",

        // 3. Bathrooms
        bathrooms: product.bathrooms || "N/A",

        // 4. Kitchen
        kitchen: product.kitchen || "N/A",

        // For Overlay
        plotSizeDisplay:
          product.plotSize || product["Attribute 1 value(s)"] || "N/A",

        categoryDisplay: "Floor Plan + 3D",
        productNo: product.productNo || null,
        city: city,

        isSale,
        displayPrice,
        regularPrice,
        videoId: getYouTubeId(product.youtubeLink),
        isWishlisted: isInWishlist(product._id),
        hasPurchased: purchasedProductIds.has(product._id),
      };
    });
  }, [adminProducts, professionalPlans, purchasedProductIds, isInWishlist]);

  const handleWishlistToggle = (product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const wishlistItem = {
      productId: product.id,
      name: product.displayName,
      price: product.regularPrice,
      salePrice: product.isSale ? product.displayPrice : null,
      image: product.mainImage,
      size: product.plotSizeDisplay,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist" });
    } else {
      addToWishlist(wishlistItem);
      toast({ title: "Added to Wishlist!" });
    }
  };

  const handleDownload = (product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!product.hasPurchased)
      return toast({ variant: "destructive", title: "Purchase Required" });

    const files = product.planFile || product["Download 1 URL"] || [];
    const fileUrl = Array.isArray(files) ? files[0] : files;

    if (!fileUrl)
      return toast({ variant: "destructive", title: "No Files Found" });

    window.open(fileUrl, "_blank");
    toast({ title: "Download Started" });
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const isLoading = adminStatus === "loading" || profStatus === "loading";

  if (isLoading)
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
        {/* Header Section */}
        <div className="flex justify-center items-end mb-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Latest Floor Plans + 3D Elevation
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore our newest residential layouts
            </p>
          </div>
          {/* Desktop View All Button */}
          <Link
            to="/3d-plans"
            className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2"
          >
            <Button variant="outline">View All Designs</Button>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
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

          {/* Scrollable Area */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-6 md:gap-8">
              {processedData.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[320px] snap-start"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* --- CARD IMAGE SECTION (MATCHING ThreeDPlansPage) --- */}
                  <div className="relative border-b p-3 sm:p-4">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.mainImage}
                        alt={product.displayName}
                        className="w-full h-48 sm:h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {product.isSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-md shadow-md z-10">
                        Sale!
                      </div>
                    )}
                    {product.hasPurchased && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md z-10">
                        Purchased
                      </div>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-md shadow-lg z-10 text-center max-w-[90%]">
                      <p className="truncate">{product.plotSizeDisplay}</p>
                      <p className="text-[10px] sm:text-xs font-normal">
                        {product.hasPurchased
                          ? "Download pdf file"
                          : "Purchase to download"}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${product.isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
                      >
                        <Heart
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill={product.isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                      {product.videoId && (
                        <button
                          onClick={() => setPlayingVideoId(product.videoId)}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                        >
                          <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* --- 2x2 GRID STATS (MATCHING ThreeDPlansPage EXACTLY) --- */}
                  <div className="p-3 sm:p-4 border-b">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                      <div className="p-2">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Plot Area
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {product.plotAreaDisplay} sqft
                        </p>
                      </div>
                      <div className="bg-teal-50 p-2 rounded-md">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Rooms
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {product.roomsDisplay}
                        </p>
                      </div>
                      <div className="bg-teal-50 p-2 rounded-md">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Bathrooms
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {product.bathrooms}
                        </p>
                      </div>
                      <div className="p-2">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Kitchen
                        </p>
                        <p className="font-semibold text-sm sm:text-base text-gray-800">
                          {product.kitchen}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* --- INFO & BUTTONS SECTION --- */}
                  <div className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500 uppercase">
                      {product.categoryDisplay}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-1 truncate">
                      {product.displayName}
                    </h3>

                    {/* Price with Save Badge */}
                    <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                      {product.isSale &&
                        parseFloat(String(product.regularPrice)) > 0 && (
                          <s className="text-sm sm:text-md text-gray-400">
                            <DisplayPrice
                              inrPrice={parseFloat(
                                String(product.regularPrice)
                              )}
                            />
                          </s>
                        )}
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        <DisplayPrice
                          inrPrice={parseFloat(String(product.displayPrice))}
                        />
                      </span>
                      {product.isSale &&
                        parseFloat(String(product.regularPrice)) > 0 &&
                        parseFloat(String(product.displayPrice)) > 0 && (
                          <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold">
                            SAVE {symbol}
                            {(
                              (parseFloat(String(product.regularPrice)) -
                                parseFloat(String(product.displayPrice))) *
                              rate
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        )}
                    </div>

                    <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2">
                      <Link to={`/product/${product.slug}`}>
                        <Button className="w-full text-sm sm:text-base bg-slate-800 text-white hover:bg-slate-700 hover:text-white rounded-md py-2 h-auto">
                          Read more
                        </Button>
                      </Link>
                      <Button
                        className={`w-full text-sm sm:text-base text-white rounded-md py-2 h-auto ${product.hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
                        onClick={() => handleDownload(product)}
                        disabled={!product.hasPurchased}
                      >
                        {product.hasPurchased ? (
                          <>
                            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Download PDF
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Purchase to Download
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

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/3d-plans">
            <Button variant="outline" className="w-full">
              View All Designs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeElevations;
