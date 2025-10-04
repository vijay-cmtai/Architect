import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  ServerCrash,
  Download,
  Filter,
  Heart,
  ChevronLeft,
  ChevronRight,
  Lock,
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
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import house3 from "@/assets/house-3.jpg";

const themes = [
  "Modern Theme",
  "Contemporary Theme",
  "Minimalist Theme",
  "Traditional Theme",
  "Industrial Theme",
  "Bohemian (Boho) Theme",
  "Scandinavian Theme",
  "Rustic Theme",
  "Transitional Theme",
  "Eclectic Theme",
];

const FilterSidebar = ({ filters, setFilters }: any) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-white rounded-xl shadow-lg h-fit border border-gray-200 sticky top-24">
    <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
      <Filter className="w-5 h-5 mr-2 text-gray-500" />
      Filters
    </h3>
    <div className="space-y-6">
      <div>
        <Label htmlFor="theme" className="font-semibold text-gray-600">
          Theme
        </Label>
        <Select
          value={filters.theme}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, theme: value }))
          }
        >
          <SelectTrigger
            id="theme"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="roomType" className="font-semibold text-gray-600">
          Room Type
        </Label>
        <Select
          value={filters.roomType}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, roomType: value }))
          }
        >
          <SelectTrigger
            id="roomType"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="Kitchen">Kitchen</SelectItem>
            <SelectItem value="Bedroom">Bedroom</SelectItem>
            <SelectItem value="Living Room">Living Room</SelectItem>
            <SelectItem value="Bathroom">Bathroom</SelectItem>
            <SelectItem value="Dining Room">Dining Room</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="propertyType" className="font-semibold text-gray-600">
          Property Type
        </Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, propertyType: value }))
          }
        >
          <SelectTrigger
            id="propertyType"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
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
            setFilters((prev: any) => ({
              ...prev,
              budget: value as [number, number],
            }))
          }
          max={50000}
          min={500}
          step={100}
          className="mt-3"
        />
      </div>
      <Button
        onClick={() =>
          setFilters({
            theme: "all",
            category: "all",
            roomType: "all",
            propertyType: "all",
            budget: [500, 50000],
          })
        }
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  </aside>
);

const ProductCard = ({ product, userOrders }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const isWishlisted = isInWishlist(product._id);
  const productName =
    product.name || product.planName || product.Name || "Interior Design";
  const linkTo =
    product.source === "admin"
      ? `/product/${product._id}`
      : `/professional-plan/${product._id}`;
  const hasPurchased = userOrders?.some(
    (order: any) =>
      order.isPaid &&
      order.orderItems?.some(
        (item: any) =>
          item.productId === product._id || item.productId?._id === product._id
      )
  );

  const handleDownload = async () => {
    /* ... (This function is correct) ... */
  };

  const regularPrice = product.price || product["Regular price"] || 0;
  const salePrice = product.salePrice || product["Sale price"] || 0;
  const isSale = salePrice > 0 && salePrice < regularPrice;
  const displayPrice = isSale ? salePrice : regularPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative p-2">
        <Link to={linkTo}>
          <img
            src={
              product.mainImage ||
              product.image ||
              product.Images?.split(",")[0] ||
              house3
            }
            alt={productName}
            className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isSale && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              isWishlisted
                ? removeFromWishlist(product._id)
                : addToWishlist(product);
            }}
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="py-2">
            <p className="text-xs text-gray-500">Style</p>
            <p className="font-bold text-gray-800">
              {product.style || product.category || "N/A"}
            </p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Room Type</p>
            <p className="font-bold text-gray-800">
              {product.roomType || product.size || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <p className="text-xs text-gray-500 uppercase">
          {Array.isArray(product.category)
            ? product.category[0]
            : product.category || "Interior Design"}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          {isSale && (
            <s className="text-md text-gray-400">
              ₹{regularPrice.toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            ₹{displayPrice.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-4 pt-2 mt-auto grid grid-cols-1 gap-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Read more
          </Button>
        </Link>
        <Button
          className={`w-full text-white rounded-md ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!hasPurchased}
        >
          {hasPurchased ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const InteriorDesignsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  // Get data from both slices
  const {
    products: adminProducts,
    count: adminCount,
    pages: adminPages,
    listStatus: adminListStatus,
    error: adminError,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    listStatus: profListStatus,
    error: profError,
  } = useSelector((state: RootState) => state.professionalPlans);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    theme: "all",
    category: "all",
    roomType: "all",
    propertyType: "all",
    budget: [500, 50000] as [number, number],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "interior-designs",
    };
    if (filters.theme !== "all") params.theme = filters.theme;
    if (filters.roomType !== "all") params.roomType = filters.roomType;
    if (filters.propertyType !== "all")
      params.propertyType = filters.propertyType;
    if (sortBy !== "newest") params.sortBy = sortBy;
    if (filters.budget[0] !== 500 || filters.budget[1] !== 50000) {
      params.budget = `${filters.budget[0]}-${filters.budget[1]}`;
    }
    dispatch(fetchProducts(params));
    dispatch(fetchAllApprovedPlans(params));
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo, currentPage, filters, sortBy]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, sortBy]);

  // FIX: Simplified and corrected product combination
  const combinedProducts = useMemo(
    () => [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({ ...p, source: "admin" }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({ ...p, source: "professional" }))
        : []),
    ],
    [adminProducts, professionalPlans]
  );

  // Note: Pagination info from `products` slice is primarily used, assuming it's the main source.
  const totalCount = adminCount || 0;
  const totalPages = adminPages > 0 ? adminPages : 1;

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError || "An error occurred.");

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Readymade Interior Designs | Modern Home Interiors Online</title>
        <meta
          name="description"
          content="Explore readymade interior designs for living rooms, bedrooms, kitchens, and offices. Modern, stylish, and affordable interiors tailored for every home."
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            uniqueCategories={[]}
          />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Interior Design Plans
                </h1>
                {/* FIX: Use totalCount from state */}
                <p className="text-gray-500 text-sm">
                  Showing {combinedProducts.length} of {totalCount} results
                </p>
              </div>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Sort by latest</SelectItem>
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
                <h3 className="mt-4 text-xl font-semibold text-red-500">
                  Failed to Load Interior Designs
                </h3>
                <p className="mt-2 text-gray-500">{errorMessage}</p>
              </div>
            )}

            {/* FIX: Corrected rendering logic */}
            {!isLoading && !isError && (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {combinedProducts.length > 0 ? (
                    combinedProducts.map((product) => (
                      <ProductCard
                        key={`${product.source}-${product._id}`}
                        product={product}
                        userOrders={orders}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <h3 className="text-xl font-semibold">
                        No Interior Designs Found
                      </h3>
                      <p className="mt-2 text-gray-500">
                        Try adjusting your filters to see more results.
                      </p>
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
