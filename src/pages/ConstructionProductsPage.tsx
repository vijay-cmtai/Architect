// src/pages/ConstructionProductsPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ServerCrash,
  Filter,
  Search,
  Download,
  Heart,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import house1 from "@/assets/house-1.jpg";
import { useWishlist } from "@/contexts/WishlistContext";

// दोनों thunks को import करें
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";

// --- FilterSidebar Component ---
const FilterSidebar = ({ filters, setFilters, uniqueCategories }) => (
  <aside className="w-full lg:w-80 shrink-0">
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
      <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
        <Filter className="w-5 h-5 mr-3 text-gray-500" />
        Filters
      </h3>
      <div className="space-y-6">
        <div>
          <Label className="font-semibold text-gray-600">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(v) => setFilters((p) => ({ ...p, category: v }))}
          >
            <SelectTrigger className="mt-2 bg-gray-100 border-transparent h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold text-gray-600">Plot Size</Label>
          <Select
            value={filters.plotSize}
            onValueChange={(v) => setFilters((p) => ({ ...p, plotSize: v }))}
          >
            <SelectTrigger className="mt-2 bg-gray-100 border-transparent h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
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
            min={0}
            step={500}
            className="mt-3"
          />
        </div>
      </div>
    </div>
  </aside>
);

// --- ProductCard Component ---
const ProductCard = ({ plan }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(plan._id);
  const linkTo =
    plan.source === "admin"
      ? `/product/${plan._id}`
      : `/professional-plan/${plan._id}`;

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
            src={plan.image || house1}
            alt={plan.name}
            className="w-full h-48 object-cover rounded-md"
          />
        </Link>
        <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
          <p>{plan.plotSize} House plan</p>
          <p className="text-xs font-normal">Download pdf file</p>
        </div>
        {plan.isSale && (
          <div className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        <button
          onClick={() =>
            isWishlisted ? removeFromWishlist(plan._id) : addToWishlist(plan)
          }
          className={`absolute top-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
        >
          <Heart
            className="w-5 h-5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{plan.plotArea} sqft</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{plan.rooms || plan.bhk} BHK</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{plan.bathrooms}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{plan.kitchen}</p>
        </div>
      </div>
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">{plan.category}</p>
        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          {plan.isSale && (
            <s className="text-md text-gray-400">
              ₹{plan.price.toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            ₹{(plan.isSale ? plan.salePrice : plan.price).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-2">
        <Link to={linkTo} className="col-span-2">
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Read more
          </Button>
        </Link>
        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white col-span-2">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </motion.div>
  );
};

const ConstructionProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

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

  const [filters, setFilters] = useState({
    category: "all",
    searchTerm: "",
    budget: [0, 50000],
    plotSize: "all",
  });
  const [sortBy, setSortBy] = useState("newest");

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

  const constructionProducts = useMemo(
    () =>
      combinedProducts.filter((p) => p.planType === "Construction Products"),
    [combinedProducts]
  );

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(
      constructionProducts.map((p) => p.category).filter(Boolean)
    );
    return Array.from(categoriesSet);
  }, [constructionProducts]);

  // ✨ FIX: Updated filtering logic ✨
  const filteredProducts = useMemo(() => {
    return constructionProducts.filter((product) => {
      // Type Guard: Ensure the product has the necessary properties
      if (typeof product.price !== "number") {
        return false;
      }

      const productPrice =
        product.isSale && typeof product.salePrice === "number"
          ? product.salePrice
          : product.price;
      const productName = product.name || "";
      const productCategory = product.category || "";

      const matchesSearch =
        productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        productCategory
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesBudget =
        productPrice >= filters.budget[0] && productPrice <= filters.budget[1];
      const matchesCategory =
        filters.category === "all" || productCategory === filters.category;
      const matchesPlotSize =
        filters.plotSize === "all" || product.plotSize === filters.plotSize;

      return (
        matchesSearch && matchesBudget && matchesCategory && matchesPlotSize
      );
    });
  }, [constructionProducts, filters]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError);

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
          <div className="w-full">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <p className="text-gray-500">
                Showing {filteredProducts.length} results
              </p>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
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
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((plan) => (
                    <ProductCard
                      key={`${plan.source}-${plan._id}`}
                      plan={plan}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <h3 className="text-xl font-semibold">No Products Found</h3>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConstructionProductsPage;
