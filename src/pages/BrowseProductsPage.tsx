import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  ServerCrash,
  Filter,
  Heart,
  Download,
  Lock,
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
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useWishlist } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import house3 from "@/assets/house-3.jpg";
import { useToast } from "@/components/ui/use-toast";

const slugify = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const FilterSidebar = ({ filters, setFilters }: any) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-card rounded-xl shadow-lg h-fit border border-border sticky top-24">
    <h3 className="text-xl font-bold mb-4 flex items-center">
      <Filter className="w-5 h-5 mr-2" /> Filters
    </h3>
    <div className="space-y-6">
      <div>
        <Label htmlFor="plotSize">Plot Size</Label>
        <Select
          value={filters.plotSize}
          onValueChange={(value) =>
            setFilters((prev: any) => ({ ...prev, plotSize: value }))
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
            setFilters((prev: any) => ({ ...prev, plotArea: value }))
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
            setFilters((prev: any) => ({ ...prev, budget: value }))
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
            setFilters((prev: any) => ({ ...prev, bhk: value }))
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
            setFilters((prev: any) => ({ ...prev, direction: value }))
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
            setFilters((prev: any) => ({ ...prev, floors: value }))
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
            setFilters((prev: any) => ({ ...prev, propertyType: value }))
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

const ProductCard = ({ plan: product, userOrders }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);

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

  // FIXED: Proper pricing logic for both admin and JSON products
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
      : product["Sale price"] && parseFloat(String(product["Sale price"])) > 0
        ? parseFloat(String(product["Sale price"]))
        : null;

  const isSale =
    salePrice !== null &&
    salePrice > 0 &&
    regularPrice > 0 &&
    salePrice < regularPrice;

  const displayPrice = isSale ? salePrice : regularPrice;

  const category =
    (Array.isArray(product.category)
      ? product.category[0]
      : product.category) ||
    product.Categories?.split(",")[0].trim() ||
    "House Plan";

  const isWishlisted = isInWishlist(product._id);
  const linkTo = `/product/${slugify(productName)}-${product._id}`;

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order: any) =>
        order.isPaid &&
        order.orderItems?.some(
          (item: any) => (item.productId?._id || item.productId) === product._id
        )
    );
  }, [userOrders, userInfo, product._id]);

  const handleWishlistToggle = () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    const productForWishlist = {
      productId: product._id,
      name: productName,
      price: regularPrice,
      salePrice: salePrice,
      image: mainImage,
      size: plotSize,
    };
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

  const handleDownload = async () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast({
        title: "Not Purchased",
        description: "Please purchase this plan to download it.",
        variant: "destructive",
      });
      navigate(linkTo);
      return;
    }
    const planFileUrl =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!planFileUrl) {
      toast({
        title: "Error",
        description: "No downloadable file found.",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to download the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
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
            onClick={handleWishlistToggle}
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
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          {isSale && regularPrice > 0 && (
            <s className="text-md text-gray-500">
              ₹{regularPrice.toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-900">
            {displayPrice > 0 ? `₹${displayPrice.toLocaleString()}` : "Free"}
          </span>
          {isSale && regularPrice > 0 && displayPrice > 0 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
              SAVE ₹{(regularPrice - displayPrice).toLocaleString()}
            </span>
          )}
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

const BrowsePlansPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    products: adminProducts,
    count: adminCount,
    pages: adminPages,
    listStatus: adminListStatus,
    error: adminError,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    count: profCount,
    pages: profPages,
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
    budget: [0, 50000] as [number, number],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 12;

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: CARDS_PER_PAGE,
      planCategory: "floor-plans",
    };

    if (filters.plotSize !== "all") params.plotSize = filters.plotSize;
    if (filters.plotArea !== "all") params.plotArea = filters.plotArea;
    if (filters.bhk !== "all") params.bhk = filters.bhk;
    if (filters.direction !== "all") params.direction = filters.direction;
    if (filters.floors !== "all") params.floors = filters.floors;
    if (filters.propertyType !== "all")
      params.propertyType = filters.propertyType;
    if (sortBy !== "newest") params.sortBy = sortBy;
    if (filters.budget[0] !== 0 || filters.budget[1] !== 50000) {
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

  const totalCount = (adminCount || 0) + (profCount || 0);
  const totalPages = Math.max(adminPages || 1, profPages || 1);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError);
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
                  Showing {combinedProducts.length} of {totalCount} results
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
                <p className="mt-2 text-muted-foreground">{errorMessage}</p>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {combinedProducts.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {combinedProducts.map((plan) => (
                      <ProductCard
                        key={`${plan.source || "prod"}-${plan._id}`}
                        plan={plan}
                        userOrders={orders}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold">No Plans Found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your filters.
                    </p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
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

export default BrowsePlansPage;
