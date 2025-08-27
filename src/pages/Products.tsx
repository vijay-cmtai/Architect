import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  Grid,
  List,
  Heart,
  Download,
  Loader2,
  ServerCrash,
  X,
  Youtube,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWishlist } from "@/contexts/WishlistContext";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";

const Products = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const countryQuery = searchParams.get("country");

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

  const [viewMode, setViewMode] = useState("grid");
  const [budget, setBudget] = useState<[number, number]>([500, 50000]);
  const [plotSize, setPlotSize] = useState("all");
  const [plotArea, setPlotArea] = useState("all");
  const [bhk, setBhk] = useState("all");
  const [direction, setDirection] = useState("all");
  const [floors, setFloors] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState(categoryQuery || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const apiParams: { country?: string } = {};
    if (countryQuery) apiParams.country = countryQuery;
    dispatch(fetchProducts(apiParams));
    dispatch(fetchAllApprovedPlans());
  }, [dispatch, countryQuery]);

  useEffect(() => {
    setCategory(categoryQuery || "all");
  }, [categoryQuery]);

  // Combine and format products
  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    const formattedAdminProducts = adminArray.map((p) => ({
      ...p,
      image: p.image || house1,
      source: "admin",
    }));
    const formattedProfPlans = profArray.map((p) => ({
      ...p,
      name: p.planName,
      image: p.mainImage || house2,
      source: "professional",
    }));
    return [...formattedAdminProducts, ...formattedProfPlans];
  }, [adminProducts, professionalPlans]);

  // Filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = combinedProducts.filter((product) => {
      if (!product || typeof product.price === "undefined") return false;

      const productPrice =
        product.isSale && product.salePrice ? product.salePrice : product.price;

      const matchesBhk =
        bhk === "all" ||
        Number(product.rooms ?? product.bhk ?? "") === Number(bhk);
      const matchesFloors =
        floors === "all" || Number(product.floors ?? "") === Number(floors);

      const plotSizeStr = (product.plotSize ?? "").toLowerCase();
      const nameStr = (product.name ?? "").toLowerCase();
      const searchStr = (searchQuery ?? "").toLowerCase();
      const plotAreaNum = Number(product.plotArea ?? 0);

      return (
        (!searchQuery ||
          plotSizeStr.includes(searchStr) ||
          nameStr.includes(searchStr)) &&
        productPrice >= budget[0] &&
        productPrice <= budget[1] &&
        (plotSize === "all" || product.plotSize === plotSize) &&
        (plotArea === "all" ||
          (plotArea === "500-1000"
            ? plotAreaNum >= 500 && plotAreaNum <= 1000
            : plotArea === "1000-2000"
              ? plotAreaNum > 1000 && plotAreaNum <= 2000
              : plotArea === "2000+"
                ? plotAreaNum > 2000
                : true)) &&
        matchesBhk &&
        (direction === "all" || product.direction === direction) &&
        matchesFloors &&
        (propertyType === "all" || product.propertyType === propertyType) &&
        (category === "all" || product.category === category) &&
        (!countryQuery || product.country === countryQuery)
      );
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        return sorted.sort(
          (a, b) =>
            (a.isSale && a.salePrice ? a.salePrice : a.price) -
            (b.isSale && b.salePrice ? b.salePrice : b.price)
        );
      case "price-high":
        return sorted.sort(
          (a, b) =>
            (b.isSale && b.salePrice ? b.salePrice : b.price) -
            (a.isSale && a.salePrice ? a.salePrice : a.price)
        );
      default:
        return sorted;
    }
  }, [
    combinedProducts,
    budget,
    plotSize,
    plotArea,
    bhk,
    direction,
    floors,
    propertyType,
    searchQuery,
    category,
    countryQuery,
    sortBy,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / CARDS_PER_PAGE
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [currentPage, filteredAndSortedProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedProducts]);

  const uniqueCategories = useMemo(() => {
    if (!combinedProducts) return [];
    const categoriesSet = new Set(
      combinedProducts.map((p) => p.category).filter(Boolean)
    );
    return Array.from(categoriesSet).sort();
  }, [combinedProducts]);

  const handleDownload = (imageUrl: string, productName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.setAttribute(
      "download",
      `ArchHome-${productName.replace(/\s+/g, "-")}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageTitle = countryQuery
    ? `${countryQuery} House Plans`
    : "House Plans & Designs";
  const pageDescription = countryQuery
    ? `Browse plans available in ${countryQuery}`
    : "Discover our complete collection of architectural masterpieces";

  const renderProductGrid = () => {
    const isLoading =
      adminListStatus === "loading" || profListStatus === "loading";
    const hasError =
      adminListStatus === "failed" || profListStatus === "failed";

    if (isLoading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    if (hasError) {
      return (
        <div className="col-span-full text-center py-20">
          <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">
            Failed to Load Products
          </h3>
          <p className="mt-2 text-muted-foreground">
            {String(adminError || profError) || "An error occurred."}
          </p>
        </div>
      );
    }
    if (paginatedProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-20">
          <h3 className="text-xl font-semibold">No Plans Found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or clear the search.
          </p>
        </div>
      );
    }

    return paginatedProducts.map((product: any) => {
      const isWishlisted = isInWishlist(product._id);
      return (
        <div
          key={`${product.source}-${product._id}`}
          className="bg-card rounded-lg shadow-soft border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="relative border-b p-4">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.mainImage || product.image || house3}
                alt={product.name}
                className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            {product.isSale && (
              <div className="absolute top-2 left-2 bg-white text-gray-800 text-sm font-semibold px-4 py-1.5 rounded-md shadow-md z-10">
                Sale!
              </div>
            )}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg z-10 text-center">
              <p>{product.plotSize} House plan</p>
              <p className="text-xs font-normal">Download pdf file</p>
            </div>
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  isWishlisted
                    ? removeFromWishlist(product._id)
                    : addToWishlist(product)
                }
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
                  className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm text-white hover:bg-red-600 hover:scale-110"
                  aria-label="Watch on YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Plot Area</p>
                <p className="font-semibold text-gray-800">
                  {product.plotArea} sqft
                </p>
              </div>
              <div className="bg-teal-50 p-2 rounded-md">
                <p className="text-sm text-gray-500">Rooms</p>
                <p className="font-semibold text-gray-800">
                  {product.rooms || product.bhk} BHK
                </p>
              </div>
              <div className="bg-teal-50 p-2 rounded-md">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-semibold text-gray-800">
                  {product.bathrooms}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kitchen</p>
                <p className="font-semibold text-gray-800">{product.kitchen}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 uppercase">
              {product.category || "House Plan"}
            </p>
            <h3 className="text-lg font-bold text-gray-800 mt-1">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              {product.isSale && (
                <s className="text-md text-gray-500">
                  ₹{product.price.toLocaleString()}
                </s>
              )}
              <span className="text-xl font-bold text-gray-900">
                ₹
                {(product.isSale && product.salePrice
                  ? product.salePrice
                  : product.price
                ).toLocaleString()}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Link to={`/product/${product._id}`}>
                <Button
                  variant="outline"
                  className="w-full bg-slate-800 text-white hover:bg-slate-700 rounded-md"
                >
                  Read more
                </Button>
              </Link>
              <Button
                className="w-full bg-teal-500 text-white hover:bg-teal-600 rounded-md"
                onClick={() => handleDownload(product.image, product.name)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {pageTitle}
          </h1>
          <p className="text-xl text-muted-foreground">{pageDescription}</p>
          {(countryQuery || categoryQuery || searchQuery) && (
            <div className="mt-4">
              <Link to="/products">
                <Button variant="destructive" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 space-y-6">
            <div className="bg-card p-6 rounded-2xl shadow-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Plot Size
                </label>
                <Select value={plotSize} onValueChange={setPlotSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plot Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="21x56">21x56</SelectItem>
                    <SelectItem value="40x65">40x65</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Plot Area (sqft)
                </label>
                <Select value={plotArea} onValueChange={setPlotArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plot Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="500-1000">500-1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Budget: ₹{budget[0].toLocaleString()} - ₹
                  {budget[1].toLocaleString()}
                </label>
                <Slider
                  value={budget}
                  onValueChange={setBudget as (value: number[]) => void}
                  max={50000}
                  min={500}
                  step={100}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  BHK
                </label>
                <Select value={bhk} onValueChange={setBhk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All BHK</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Direction
                </label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Directions</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Floors
                </label>
                <Select value={floors} onValueChange={setFloors}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">
                Showing {paginatedProducts.length} of{" "}
                {filteredAndSortedProducts.length} results
              </p>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
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
            </div>
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {renderProductGrid()}
            </div>
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
