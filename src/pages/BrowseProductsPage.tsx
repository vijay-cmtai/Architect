import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  ServerCrash,
  Filter,
  Heart,
  Download,
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
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useWishlist } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import house3 from "@/assets/house-3.jpg";
import { useToast } from "@/components/ui/use-toast";

// --- Slugify Helper Function (from Products.jsx) ---
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

// --- FilterSidebar Component (No changes needed) ---
const FilterSidebar = ({ filters, setFilters }) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-card rounded-xl shadow-lg h-fit border border-border">
    <h3 className="text-xl font-bold mb-4 flex items-center">
      <Filter className="w-5 h-5 mr-2" />
      Filters
    </h3>
    <div className="space-y-6">
      <div>
        <Label htmlFor="plotSize">Plot Size</Label>
        <Select
          value={filters.plotSize}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, plotSize: value }))
          }
        >
          <SelectTrigger id="plotSize">
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="26X45 SQFT">26X45 SQFT</SelectItem>
            <SelectItem value="30x40">30x40</SelectItem>
            <SelectItem value="40x60">40x60</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="plotArea">Plot Area (sqft)</Label>
        <Select
          value={filters.plotArea}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, plotArea: value }))
          }
        >
          <SelectTrigger id="plotArea">
            <SelectValue placeholder="Select Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="500-1000">500-1000</SelectItem>
            <SelectItem value="1000-2000">1000-2000</SelectItem>
            <SelectItem value="2000+">2000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>
          Budget: ₹{filters.budget[0].toLocaleString()} - ₹
          {filters.budget[1].toLocaleString()}
        </Label>
        <Slider
          value={filters.budget}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, budget: value }))
          }
          max={50000}
          min={0}
          step={500}
        />
      </div>
      <div>
        <Label htmlFor="bhk">Rooms (BHK)</Label>
        <Select
          value={filters.bhk}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, bhk: value }))
          }
        >
          <SelectTrigger id="bhk">
            <SelectValue placeholder="Select Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All BHKs</SelectItem>
            <SelectItem value="1">1 BHK</SelectItem>
            <SelectItem value="2">2 BHK</SelectItem>
            <SelectItem value="3">3 BHK</SelectItem>
            <SelectItem value="4">4+ BHK</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="direction">Direction</Label>
        <Select
          value={filters.direction}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, direction: value }))
          }
        >
          <SelectTrigger id="direction">
            <SelectValue placeholder="Select Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="East">East</SelectItem>
            <SelectItem value="West">West</SelectItem>
            <SelectItem value="North">North</SelectItem>
            <SelectItem value="South">South</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="floors">Floors</Label>
        <Select
          value={filters.floors}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, floors: value }))
          }
        >
          <SelectTrigger id="floors">
            <SelectValue placeholder="Select Floors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, propertyType: value }))
          }
        >
          <SelectTrigger id="propertyType">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={() =>
          setFilters({
            plotArea: "all",
            plotSize: "all",
            bhk: "all",
            direction: "all",
            floors: "all",
            propertyType: "all",
            budget: [0, 50000],
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

// --- ProductCard Component (Updated with robust logic from Products.jsx) ---
const ProductCard = ({ plan: product, userOrders }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);

  // --- Start: Data Normalization (Logic from Products.jsx) ---
  const getImageSource = () => {
    const primaryImage = product.mainImage || product.image || product.Images;
    if (primaryImage && typeof primaryImage === "string") {
      return primaryImage.split(",")[0].trim();
    }
    return house3;
  };
  const mainImage = getImageSource();

  const productName =
    product.name || product.planName || product.Name || "Untitled Plan";
  const plotSize = product.plotSize || product["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    product.plotArea ||
    (product["Attribute 2 value(s)"]
      ? parseInt(String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, ""))
      : "N/A");
  const rooms = product.rooms || product["Attribute 3 value(s)"] || "N/A";
  const bathrooms = product.bathrooms || "N/A";
  const kitchen = product.kitchen || "N/A";

  const regularPrice = product.price ?? product["Regular price"] ?? 0;
  const salePrice = product.salePrice ?? product["Sale price"];

  const isSale = (() => {
    if (salePrice != null) {
      return (
        parseFloat(salePrice) > 0 &&
        parseFloat(salePrice) < parseFloat(regularPrice)
      );
    }
    return product.isSale || false;
  })();

  const displayPrice = isSale && salePrice != null ? salePrice : regularPrice;
  const category =
    (Array.isArray(product.category)
      ? product.category[0]
      : product.category) ||
    product.Categories?.split(",")[0].trim() ||
    "House Plan";
  // --- End: Data Normalization ---

  const isWishlisted = isInWishlist(product._id);
  const linkTo = `/product/${slugify(productName)}-${product._id}`;

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order) =>
        order.isPaid &&
        order.orderItems?.some((item) => item.productId?._id === product._id)
    );
  }, [userOrders, userInfo, product._id]);

  const handleDownload = async () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
      });
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast({
        title: "Not Purchased",
        description: "Please purchase this plan to download it.",
      });
      navigate(linkTo);
      return;
    }
    const planFileUrl =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!planFileUrl) {
      toast({ title: "Error", description: "No downloadable file found." });
      return;
    }
    try {
      toast({ title: "Success", description: "Your download is starting..." });
      const response = await fetch(planFileUrl);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExtension =
        planFileUrl.split(".").pop()?.split("?")[0] || "pdf";
      a.download = `ArchHome-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast({ title: "Error", description: "Failed to download the file." });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-card rounded-lg shadow-soft border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative border-b p-4">
        <Link to={linkTo}>
          <img
            src={mainImage}
            alt={productName}
            className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {isSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md z-10">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg z-10 text-center">
          <p>{plotSize} House plan</p>
          <p className="text-xs font-normal">
            {hasPurchased ? "Download pdf file" : "Purchase to download"}
          </p>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              isWishlisted
                ? removeFromWishlist(product._id)
                : addToWishlist(product);
            }}
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Plot Area</p>
            <p className="font-semibold text-gray-800">{plotArea} sqft</p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-sm text-gray-500">Rooms</p>
            <p className="font-semibold text-gray-800">{rooms}</p>
          </div>
          <div className="bg-teal-50 p-2 rounded-md">
            <p className="text-sm text-gray-500">Bathrooms</p>
            <p className="font-semibold text-gray-800">{bathrooms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kitchen</p>
            <p className="font-semibold text-gray-800">{kitchen}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 uppercase">{category}</p>
        <h3 className="text-lg font-bold text-gray-800 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          {isSale && regularPrice > 0 && (
            <s className="text-md text-gray-500">
              ₹{parseFloat(regularPrice).toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-900">
            ₹
            {displayPrice > 0
              ? parseFloat(displayPrice).toLocaleString()
              : "Free"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link to={linkTo}>
            <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 hover:text-white rounded-md">
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
      </div>
    </motion.div>
  );
};

// --- BrowsePlansPage (Main Component) ---
const BrowsePlansPage = () => {
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
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [filters, setFilters] = useState({
    plotArea: "all",
    plotSize: "all",
    bhk: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [0, 50000],
  });

  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const apiParams: Record<string, any> = {};
    // ... API params logic can be added here if needed for server-side filtering
    dispatch(fetchProducts({})); // Fetch all products
    dispatch(fetchAllApprovedPlans({})); // Fetch all plans

    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo]);

  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    return [...adminArray, ...profArray];
  }, [adminProducts, professionalPlans]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = combinedProducts.filter((product) => {
      if (!product || !product._id) return false;

      // --- START: MODIFIED FILTER LOGIC FOR FLOOR PLANS ---
      const isPlanTypeMatch = product.planType === "Floor Plans";
      let isCategoryMatch = false;
      const categoriesArray = Array.isArray(product.category)
        ? product.category
        : [];
      const categoriesString =
        product.Categories ||
        (typeof product.category === "string" ? product.category : "");
      if (categoriesArray.length > 0) {
        isCategoryMatch = categoriesArray.some(
          (cat) => cat && cat.toLowerCase().includes("floor-plans")
        );
      }
      if (!isCategoryMatch && categoriesString) {
        isCategoryMatch = categoriesString
          .toLowerCase()
          .includes("floor-plans");
      }
      if (!isPlanTypeMatch && !isCategoryMatch) {
        return false;
      }
      // --- END: MODIFIED FILTER LOGIC ---

      // Normalize price for filtering
      const regularPrice = product.price ?? product["Regular price"] ?? 0;
      const salePrice = product.salePrice ?? product["Sale price"];
      const isSale =
        salePrice != null
          ? salePrice > 0 && salePrice < regularPrice
          : product.isSale || false;
      const displayPrice =
        isSale && salePrice != null ? salePrice : regularPrice;

      const matchesBudget =
        displayPrice >= filters.budget[0] && displayPrice <= filters.budget[1];
      const matchesPlotSize =
        filters.plotSize === "all" ||
        (product.plotSize || product["Attribute 1 value(s)"]) ===
          filters.plotSize;

      const productPlotArea =
        product.plotArea ||
        (product["Attribute 2 value(s)"]
          ? parseInt(
              String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, "")
            )
          : 0);
      const matchesPlotArea =
        filters.plotArea === "all" ||
        (filters.plotArea === "500-1000"
          ? productPlotArea >= 500 && productPlotArea <= 1000
          : filters.plotArea === "1000-2000"
            ? productPlotArea > 1000 && productPlotArea <= 2000
            : filters.plotArea === "2000+"
              ? productPlotArea > 2000
              : true);

      const productBhk = String(
        product.rooms || product["Attribute 3 value(s)"] || ""
      ).replace(/[^0-9]/g, "");
      const matchesBhk = filters.bhk === "all" || productBhk === filters.bhk;

      const matchesDirection =
        filters.direction === "all" ||
        (product.direction || product["Attribute 4 value(s)"]) ===
          filters.direction;
      const matchesFloors =
        filters.floors === "all" ||
        String(product.floors || product["Attribute 5 value(s)"] || "1") ===
          filters.floors;
      const matchesPropertyType =
        filters.propertyType === "all" ||
        product.propertyType === filters.propertyType;

      return (
        matchesBudget &&
        matchesPlotSize &&
        matchesPlotArea &&
        matchesBhk &&
        matchesDirection &&
        matchesFloors &&
        matchesPropertyType
      );
    });

    products.sort((a, b) => {
      const priceA =
        (a.isSale ? a.salePrice : (a.price ?? a["Regular price"])) ?? 0;
      const priceB =
        (b.isSale ? b.salePrice : (b.price ?? b["Regular price"])) ?? 0;
      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      // Default to newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return products;
  }, [combinedProducts, filters, sortBy]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = adminError || profError;
  const pageTitle = "Floor Plans";

  return (
    <div className="bg-background">
      <Helmet>
        <title>Floor Plans | 2BHK, 3BHK & Duplex Home Designs</title>
        <meta
          name="description"
          content="Explore modern floor plans including 2BHK, 3BHK, and duplex home designs. Find readymade layouts tailored to your plot size and budget at HousePlanFiles."
        />
      </Helmet>

      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {pageTitle}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Showing {filteredAndSortedProducts.length} results
                </p>
              </div>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
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
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {isError && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-4 text-xl font-semibold text-destructive">
                  Failed to Load Plans
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {String(errorMessage)}
                </p>
              </div>
            )}
            {!isLoading &&
              !isError &&
              filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold">No Plans Found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            {!isLoading && !isError && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filteredAndSortedProducts.map((plan) => (
                  <ProductCard
                    key={`${plan.source || "prod"}-${plan._id}`}
                    plan={plan}
                    userOrders={orders}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePlansPage;
