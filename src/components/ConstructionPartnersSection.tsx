import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  ServerCrash,
  Search,
  Store,
  Heart,
  Package,
  Filter,
} from "lucide-react";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Product Card Component (No changes needed, yeh photoUrl use kar raha hai)
const ProductCard = ({ product }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
  >
    <div className="relative">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || "https://via.placeholder.com/400x300"}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>
      <button
        className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 text-gray-600 hover:text-red-500 hover:scale-110 shadow"
        aria-label="Add to Wishlist"
      >
        <Heart className="w-5 h-5" />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
        {product.category}
      </p>
      <h3 className="text-lg font-bold text-gray-900 mt-1 truncate group-hover:text-orange-700">
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      </h3>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 border-t pt-3 mt-3">
          <img
            src={product.seller?.photoUrl || "https://via.placeholder.com/40"}
            alt={product.seller?.businessName || "Seller"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="text-xs text-gray-400">Sold by:</p>
            <p className="font-semibold text-gray-700">
              {product.seller?.businessName || "Trusted Seller"}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-extrabold text-gray-800">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <Button
          asChild
          className="w-full mt-3 bg-gray-800 hover:bg-orange-600 text-white font-semibold"
        >
          <Link to={`/product/${product._id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

// Main Marketplace Page Component
const MarketplacePage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { products, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchPublicSellerProducts());
  }, [dispatch]);

  const uniqueCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    const categories = products.map((p) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set(categories)).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    let items = products;
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.seller?.businessName?.toLowerCase().includes(searchLower)
      );
    }
    return items;
  }, [products, searchTerm, selectedCategory]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-500">
          Failed to Load Products
        </h3>
        <p className="mt-2 text-gray-500">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Marketplace | Find the Best Products from All Sellers</title>
        <meta
          name="description"
          content="Explore a wide range of products from all our trusted sellers. Filter by category, brand, and search for exactly what you need."
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
            Explore Our Marketplace
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Discover products from all our trusted sellers, all in one place.
          </p>
        </div>

        {/* --- YAHAN BADLAAV KIYA GAYA HAI --- */}
        {/* Filter Section with Search and Dropdown */}
        <div className="mb-12 p-6 bg-white rounded-xl shadow-md border flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:flex-1">
            <Label
              htmlFor="search-input"
              className="font-semibold text-gray-700"
            >
              Search Products
            </Label>
            <div className="relative mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search for products, brands, or sellers..."
                className="w-full h-12 pl-12 pr-4 rounded-lg text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[250px]">
            <Label
              htmlFor="category-filter"
              className="font-semibold text-gray-700"
            >
              Filter by Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                id="category-filter"
                className="mt-2 h-12 text-base"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* --- BADLAAV KHATAM --- */}

        <div>
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
              <Package className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-2xl font-semibold text-gray-800">
                No Products Found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
