import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
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
    // Fetch products if they are not already loaded
    if (!products || products.length === 0) {
      (dispatch as typeof store.dispatch)(fetchProducts({}));
    }
    // Fetch user's orders if they are logged in
    if (userInfo) {
      (dispatch as typeof store.dispatch)(fetchMyOrders());
    }
  }, [dispatch, products, userInfo]);

  const featuredProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).slice(0, 8);
  }, [products]);

  // Create a set of purchased product IDs for quick and efficient lookup
  const purchasedProductIds = useMemo(() => {
    if (!userInfo || !Array.isArray(orders)) {
      return new Set();
    }

    // Get all items from all paid orders
    const paidItems = orders
      .filter((order) => order.isPaid)
      .flatMap((order) => order.orderItems);

    // Return a Set of just the product IDs
    return new Set(paidItems.map((item) => item.productId));
  }, [orders, userInfo]);

  const handleDownload = (product: any) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download purchased products.",
        action: <Button onClick={() => navigate("/login")}>Login</Button>,
      });
      return;
    }

    if (purchasedProductIds.has(product._id)) {
      // User has purchased this product, proceed with download
      const downloadUrl =
        product.planFile || product.image || product.mainImage;
      if (!downloadUrl) {
        toast({ title: "Error", description: "Download file not found." });
        return;
      }
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `ArchHome-${product.name.replace(/\s+/g, "-")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // User is logged in but has not purchased this product
      toast({
        title: "Product Not Purchased",
        description: "You must purchase this plan to download the file.",
        action: (
          <Button onClick={() => navigate(`/product/${product._id}`)}>
            View Product
          </Button>
        ),
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

  const handleWishlistToggle = (product: any) => {
    const isWishlisted = isInWishlist(product._id);
    const productForWishlist = {
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image || product.mainImage,
      size: product.plotSize,
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
              className="flex overflow-hidden scroll-smooth py-4 -mx-4 px-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex gap-8">
                {featuredProducts.map((product: any, index: number) => {
                  const isWishlisted = isInWishlist(product._id);
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
                            src={product.image || product.mainImage}
                            alt={product.name}
                            className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
                          />
                        </Link>
                        {product.isSale && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                            Sale!
                          </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg z-10 text-center">
                          <p>{product.plotSize} House plan</p>
                        </div>
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
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-gray-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.plotArea}
                            </p>
                          </div>
                          <div className="bg-teal-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">BHK</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.rooms}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Bath</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.bathrooms}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-md p-2">
                            <p className="text-xs text-gray-500">Kitchen</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.kitchen}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            {product.category}
                          </p>
                          <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            {product.isSale && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{product.price.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xl font-bold text-gray-900">
                              ₹{product.salePrice.toLocaleString()}
                            </span>
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
                            className="w-full bg-teal-500 text-white hover:bg-teal-600 text-sm h-10"
                            onClick={() => handleDownload(product)}
                          >
                            <Download className="mr-2 h-4 w-4" /> PDF
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
