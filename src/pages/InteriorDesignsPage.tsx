// src/pages/InteriorDesignsPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  ServerCrash,
  Download,
  Filter,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import house3 from "@/assets/house-3.jpg";

// --- FilterSidebar Component (Updated) ---
const FilterSidebar = ({ filters, setFilters, uniqueCategories }) => (
  <aside className="w-full lg:w-80 shrink-0">
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
      <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
        <Filter className="w-5 h-5 mr-3 text-gray-500" />
        Filters
      </h3>
      <div className="space-y-6">
        <div>
          <Label className="font-semibold text-gray-600">
            Category (Style)
          </Label>
          <Select
            value={filters.category}
            onValueChange={(v) => setFilters((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger className="mt-2 bg-gray-100 border-transparent h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold text-gray-600">Room Type</Label>
          <Select
            value={filters.roomType}
            onValueChange={(v) => setFilters((p) => ({ ...p, roomType: v }))}
          >
            <SelectTrigger className="mt-2 bg-gray-100 border-transparent h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Bedroom">Bedroom</SelectItem>
              <SelectItem value="Living Room">Living Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold text-gray-600">
            Budget: ₹{filters.budget[0].toLocaleString()} - ₹
            {filters.budget[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budget}
            onValueChange={(value) =>
              setFilters((p) => ({ ...p, budget: value as [number, number] }))
            }
            max={50000}
            min={500}
            step={100}
            className="mt-3"
          />
        </div>
      </div>
    </div>
  </aside>
);

// --- ProductCard Component (Updated) ---
const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const linkTo =
    product.source === "admin"
      ? `/product/${product._id}`
      : `/professional-plan/${product._id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative p-2">
        <Link to={linkTo}>
          <img
            src={product.image || house3}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
        </Link>
        {product.isSale && (
          <div className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="py-2">
            <p className="text-xs text-gray-500">Style</p>
            <p className="font-bold text-gray-800">{product.style || "N/A"}</p>
          </div>
          <div className="bg-teal-500/10 text-teal-800 p-2 rounded-md">
            <p className="text-xs">Room Type</p>
            <p className="font-bold">
              {product.roomType || product.size || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <p className="text-xs text-gray-500 uppercase">
          {product.category || "Interior Design"}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
          {product.name || "Design Plan"}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          {product.isSale && (
            <s className="text-md text-gray-400">
              ₹{product.price.toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            ₹
            {(product.isSale
              ? product.salePrice
              : product.price
            ).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-4 pt-2 mt-auto space-y-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Read more
          </Button>
        </Link>
        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </motion.div>
  );
};

// --- Main Page ---
const InteriorDesignsPage = () => {
  const dispatch = useDispatch();
  const {
    products: adminProducts,
    listStatus: adminListStatus,
    error: adminError,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    listStatus: profListStatus,
    error: profError,
  } = useSelector((state: RootState) => state.professionalPlans);

  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    category: "all",
    roomType: "all",
    budget: [500, 50000],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllApprovedPlans());
  }, [dispatch]);

  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    const formattedAdmin = adminArray.map((p) => ({ ...p, source: "admin" }));
    const formattedProf = profArray.map((p) => ({
      ...p,
      name: p.planName,
      image: p.mainImage,
      source: "professional",
    }));
    return [...formattedAdmin, ...formattedProf];
  }, [adminProducts, professionalPlans]);

  const interiorDesigns = useMemo(
    () => combinedProducts.filter((p) => p.planType === "Interior Designs"),
    [combinedProducts]
  );

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(
      interiorDesigns.map((p) => p.category).filter(Boolean)
    );
    return Array.from(categoriesSet).sort();
  }, [interiorDesigns]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...interiorDesigns];

    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.roomType !== "all") {
      filtered = filtered.filter(
        (p) => p.roomType === filters.roomType || p.size === filters.roomType
      );
    }
    filtered = filtered.filter((p) => {
      const price = p.isSale ? p.salePrice : p.price;
      return price >= filters.budget[0] && price <= filters.budget[1];
    });

    switch (sortBy) {
      case "price-low":
        return filtered.sort(
          (a, b) =>
            (a.isSale ? a.salePrice : a.price) -
            (b.isSale ? b.salePrice : b.price)
        );
      case "price-high":
        return filtered.sort(
          (a, b) =>
            (b.isSale ? b.salePrice : b.price) -
            (a.isSale ? a.salePrice : a.price)
        );
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [interiorDesigns, filters, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / CARDS_PER_PAGE
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + CARDS_PER_PAGE
    );
  }, [currentPage, filteredAndSortedProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedProducts]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError || "An error occurred.");

  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            uniqueCategories={uniqueCategories}
          />
          <div className="flex-1">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <p className="text-gray-500">
                Showing {paginatedProducts.length} of{" "}
                {filteredAndSortedProducts.length} results
              </p>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              </div>
            )}
            {isError && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
                <h3>Error: {errorMessage}</h3>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductCard
                        key={`${product.source}-${product._id}`}
                        product={product}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-gray-500 text-lg">No designs found.</p>
                    </div>
                  )}
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <span className="font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InteriorDesignsPage;
