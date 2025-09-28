import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product, fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg"; // एक फॉलबैक इमेज

const FeaturedProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { products, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts({}));
    }
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, products, userInfo]);

  const featuredProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).slice(0, 8);
  }, [products]);

  const purchasedProductIds = useMemo(() => {
    if (!userInfo || !Array.isArray(orders)) {
      return new Set();
    }
    const paidItems = orders
      .filter((order) => order.isPaid)
      .flatMap((order) => order.orderItems);
    return new Set(
      paidItems.map((item) => item.productId?._id || item.productId)
    );
  }, [orders, userInfo]);

  const handleDownload = async (product: Product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download purchased products.",
        action: <Button onClick={() => navigate("/login")}>Login</Button>,
      });
      return;
    }

    if (!purchasedProductIds.has(product._id)) {
      toast({
        title: "Product Not Purchased",
        description: "You must purchase this plan to download the file.",
        action: (
          <Button onClick={() => navigate(`/product/${product._id}`)}>
            View Product
          </Button>
        ),
      });
      return;
    }

    const fileToDownload =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];

    if (!fileToDownload) {
      toast({
        title: "Error",
        description: "Download file is not available for this plan.",
      });
      return;
    }

    let downloadUrl = fileToDownload;
    if (downloadUrl.includes("res.cloudinary.com")) {
      const parts = downloadUrl.split("/upload/");
      if (parts.length === 2) {
        downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }

    try {
      toast({ title: "Success", description: "Your download is starting!" });
      const link = document.createElement("a");
      link.href = downloadUrl;
      const fileExtension =
        downloadUrl.split(".").pop()?.split("?")[0] || "pdf";
      link.setAttribute(
        "download",
        `ArchHome-${(product.name || product.Name).replace(/\s+/g, "-")}.${fileExtension}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "There was an issue starting your download.",
      });
    }
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

  const handleWishlistToggle = (product: Product) => {
    const isWishlisted = isInWishlist(product._id);
    const regularPrice = product.price ?? product["Regular price"] ?? 0;
    const salePrice = product.salePrice ?? product["Sale price"];

    const productForWishlist = {
      productId: product._id,
      name: product.name || product.Name,
      price: regularPrice,
      salePrice: salePrice,
      image:
        product.mainImage ||
        product.image ||
        product.Images?.split(",")[0].trim(),
      size: product.plotSize || product["Attribute 1 value(s)"],
    };
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Featured House Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and award-winning architectural designs
          </p>
        </motion.div>

        {listStatus === "loading" && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {listStatus === "failed" && (
          <div className="text-center py-12 text-destructive">
            <ServerCrash className="mx-auto h-12 w-12" />
            <p className="mt-4">Failed to load featured products.</p>
            <p className="text-sm">{String(error)}</p>
          </div>
        )}

        {listStatus === "succeeded" && (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`.flex.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
              <div className="flex gap-8">
                {featuredProducts.map((product: Product, index: number) => {
                  const isWishlisted = isInWishlist(product._id);
                  const hasPurchased = purchasedProductIds.has(product._id);

                  const getImageSource = () => {
                    const primaryImage =
                      product.mainImage || product.image || product.Images;
                    if (primaryImage && typeof primaryImage === "string") {
                      return primaryImage.split(",")[0].trim();
                    }
                    return house3;
                  };
                  const mainImage = getImageSource();

                  const productName =
                    product.name || product.Name || "Untitled Plan";

                  // FIXED: Proper field mapping
                  const plotSize =
                    product.plotSize ||
                    product["Attribute 1 value(s)"] ||
                    "N/A";

                  const plotArea =
                    product.plotArea ||
                    (product["Attribute 2 value(s)"]
                      ? parseInt(
                          String(product["Attribute 2 value(s)"]).replace(
                            /[^0-9]/g,
                            ""
                          )
                        )
                      : "N/A");

                  const rooms =
                    product.rooms || product["Attribute 3 value(s)"] || "N/A";

                  const direction =
                    product.direction ||
                    product["Attribute 4 value(s)"] ||
                    "N/A";

                  const regularPrice =
                    product.price !== 0 && product.price
                      ? product.price
                      : (product["Regular price"] ?? 0);

                  const salePrice =
                    product.salePrice !== 0 && product.salePrice
                      ? product.salePrice
                      : product["Sale price"];

                  // FIXED: Same sale detection logic as Products component
                  const isSale = (() => {
                    // JSON data के लिए Sale price field check करें FIRST (priority)
                    if (
                      product["Sale price"] !== undefined &&
                      product["Sale price"] !== null
                    ) {
                      const jsonSalePrice = parseFloat(product["Sale price"]);
                      const jsonRegularPrice = parseFloat(
                        product["Regular price"] || 0
                      );
                      // अगर sale price valid है और regular price से कम है तो sale है
                      return (
                        jsonSalePrice > 0 && jsonSalePrice < jsonRegularPrice
                      );
                    }

                    // Database data के लिए salePrice field check करें
                    if (salePrice !== undefined && salePrice !== null) {
                      return salePrice > 0 && salePrice < regularPrice;
                    }

                    // Last में product.isSale check करें (क्योंकि ये unreliable हो सकता है)
                    if (product.isSale !== undefined) {
                      return product.isSale;
                    }

                    return false;
                  })();

                  const displayPrice =
                    isSale && salePrice != null ? salePrice : regularPrice;

                  return (
                    <motion.div
                      key={product._id}
                      className="bg-card rounded-2xl overflow-hidden group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[320px]"
                      style={{ scrollSnapAlign: "start" }}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="relative border-b bg-muted/20">
                        <Link
                          to={`/product/${product._id}`}
                          className="block p-4"
                        >
                          <img
                            src={mainImage}
                            alt={productName}
                            className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
                          />
                        </Link>
                        {/* FIXED: Sale badge with proper detection */}
                        {isSale && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                            Sale!
                          </div>
                        )}
                        {hasPurchased && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                            Purchased
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
                            aria-label="Toggle Wishlist"
                          >
                            <Heart
                              className="w-5 h-5"
                              fill={isWishlisted ? "currentColor" : "none"}
                            />
                          </button>
                          {product.youtubeLink && (
                            <a
                              href={product.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                            >
                              <Youtube className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border-b">
                        {/* FIXED: Proper field mapping in display grid */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-gray-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {plotArea} {plotArea !== "N/A" ? "sqft" : ""}
                            </p>
                          </div>
                          <div className="bg-teal-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">BHK</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {rooms}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Size</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {plotSize}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Facing</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {direction || "Any"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            {(Array.isArray(product.category)
                              ? product.category[0]
                              : product.category) ||
                              product.Categories?.split(",")[0]?.trim() ||
                              "House Plan"}
                          </p>
                          <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                            {productName}
                          </h3>
                          {/* FIXED: Price display with save amount */}
                          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                            {isSale && regularPrice > 0 && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{regularPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xl font-bold text-gray-900">
                              ₹
                              {displayPrice > 0
                                ? displayPrice.toLocaleString()
                                : "N/A"}
                            </span>
                            {isSale && regularPrice > 0 && displayPrice > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                SAVE ₹
                                {(regularPrice - displayPrice).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link to={`/product/${product._id}`}>
                            <Button
                              size="sm"
                              className="w-full bg-slate-800 text-white hover:bg-slate-700 text-sm h-10"
                            >
                              Read more
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className={`w-full text-white text-sm h-10 ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
                            onClick={() => handleDownload(product)}
                            disabled={!hasPurchased}
                          >
                            {hasPurchased ? (
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
                  );
                })}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="text-center mt-16">
          <Link to="/products">
            <Button size="lg" className="px-10 py-6 text-base btn-primary">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;
