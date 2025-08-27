import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  Youtube,
  Grid,
  List,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import house3 from "@/assets/house-3.jpg"; // Fallback image

const DownloadsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  // ✨ UPDATED: Only fetches data from the main products slice ✨
  const { products, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );

  const [viewMode, setViewMode] = useState("grid");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Fetch all products without any specific filters
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // ✨ UPDATED: useMemo now only uses the main products array ✨
  const allProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  const handleDownload = (product) => {
    const downloadUrl = product.planFile || product.image; // Prioritize planFile if it exists
    if (!downloadUrl) {
      alert("Download file not available for this product.");
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

  const renderProductGrid = () => {
    if (listStatus === "loading") {
      return (
        <div className="col-span-full flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    if (listStatus === "failed") {
      return (
        <div className="col-span-full text-center py-20">
          <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">
            Failed to Load Products
          </h3>
          <p className="mt-2 text-muted-foreground">{String(error)}</p>
        </div>
      );
    }
    if (allProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-20">
          <h3 className="text-xl font-semibold">No Downloadable Plans Found</h3>
          <p className="mt-2 text-muted-foreground">Please check back later.</p>
        </div>
      );
    }

    return allProducts.map((product: any) => {
      const isWishlisted = isInWishlist(product._id);
      return (
        <div
          key={product._id}
          className="bg-card rounded-lg shadow-soft border group flex flex-col"
        >
          <div className="relative border-b p-4">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.mainImage || house3}
                alt={product.name}
                className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
            {product.isSale && (
              <div className="absolute top-2 left-2 bg-white text-sm font-semibold px-4 py-1.5 rounded-md shadow-md z-10">
                Sale!
              </div>
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg z-10 text-center">
              <p>{product.plotSize} House plan</p>
              <p className="text-xs font-normal">Downloadable File</p>
            </div>
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm ${
                  isWishlisted ? "text-red-500" : "hover:text-primary"
                }`}
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
                  className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 uppercase mt-1">
              {product.category || "House Plan"}
            </p>
            <div className="mt-auto pt-4">
              <Button
                className="w-full bg-teal-500 text-white hover:bg-teal-600 rounded-md"
                onClick={() => handleDownload(product)}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Downloadable Plans
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse all available architectural plans and resources.
          </p>
        </div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {allProducts.length} results
          </p>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {renderProductGrid()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DownloadsPage;
