import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Filter,
  Heart,
  Download,
  Loader2,
  ServerCrash,
  X,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  Lock,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { submitCustomizationRequest } from "@/lib/features/customization/customizationSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWishlist } from "@/contexts/WishlistContext";
import house3 from "@/assets/house-3.jpg";
import { toast } from "sonner";

// --- हेल्पर कंपोनेंट 1: FilterSidebar ---
const FilterSidebar = ({ filters, setFilters, uniqueCategories }) => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-white rounded-xl shadow-lg h-fit border border-gray-200">
    <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
      <Filter className="w-5 h-5 mr-2 text-gray-500" />
      Filters
    </h3>
    <div className="space-y-6">
      <div>
        <Label htmlFor="searchTerm" className="font-semibold text-gray-600">
          Search
        </Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="searchTerm"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="pl-10 bg-gray-100 border-transparent h-12"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category" className="font-semibold text-gray-600">
          Category
        </Label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger
            id="category"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Category" />
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
        <Label htmlFor="plotSize" className="font-semibold text-gray-600">
          Plot Size
        </Label>
        <Select
          value={filters.plotSize}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, plotSize: value }))
          }
        >
          <SelectTrigger
            id="plotSize"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="26X45 SQFT">26X45 SQFT</SelectItem>
            <SelectItem value="30x40">30x40</SelectItem>
            <SelectItem value="40x60">40x60</SelectItem>
            <SelectItem value="50x80">50x80</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="plotArea" className="font-semibold text-gray-600">
          Plot Area (sqft)
        </Label>
        <Select
          value={filters.plotArea}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, plotArea: value }))
          }
        >
          <SelectTrigger
            id="plotArea"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="direction" className="font-semibold text-gray-600">
          Direction
        </Label>
        <Select
          value={filters.direction}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, direction: value }))
          }
        >
          <SelectTrigger
            id="direction"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="floors" className="font-semibold text-gray-600">
          Floors
        </Label>
        <Select
          value={filters.floors}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, floors: value }))
          }
        >
          <SelectTrigger
            id="floors"
            className="mt-2 bg-gray-100 border-transparent h-12"
          >
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
        <Label htmlFor="propertyType" className="font-semibold text-gray-600">
          Property Type
        </Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, propertyType: value }))
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
            setFilters((prev) => ({ ...prev, budget: value }))
          }
          max={50000}
          min={0}
          step={500}
          className="mt-3"
        />
      </div>
      <Button
        onClick={() =>
          setFilters({
            category: "all",
            searchTerm: "",
            plotSize: "all",
            plotArea: "all",
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

// --- हेल्पर कंपोनेंट 2: ProductCard ---
const ProductCard = ({ product, userOrders }) => {
  const navigate = useNavigate();
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

  const productName = product.name || product.Name || "Untitled Plan";
  const plotSize = product.plotSize || product["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    product.plotArea ||
    (product["Attribute 2 value(s)"]
      ? parseInt(String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, ""))
      : "N/A");
  const rooms = product.rooms || product["Attribute 3 value(s)"] || "N/A";
  const direction =
    product.direction || product["Attribute 4 value(s)"] || "N/A";
  const floors = product.floors || product["Attribute 5 value(s)"] || "N/A";

  // FIX: Price को सही से पढ़ें (यह मुख्य बदलाव है)
  const regularPrice =
    product.price !== 0 && product.price
      ? product.price
      : (product["Regular price"] ?? 0);
  const salePrice =
    product.salePrice !== 0 && product.salePrice
      ? product.salePrice
      : product["Sale price"];

  const isSale =
    product.isSale ?? (salePrice != null && salePrice < regularPrice);
  const displayPrice = isSale && salePrice != null ? salePrice : regularPrice;

  const category =
    (Array.isArray(product.category)
      ? product.category[0]
      : product.category) ||
    product.Categories?.split(",")[0].trim() ||
    "House Plan";
  const downloadFile =
    (Array.isArray(product.planFile)
      ? product.planFile[0]
      : product.planFile) || product["Download 1 URL"];
  const city = product.city
    ? Array.isArray(product.city)
      ? product.city.join(", ")
      : product.city
    : null;

  const isWishlisted = isInWishlist(product._id);
  const linkTo = `/product/${product._id}`;

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order) =>
        order.isPaid &&
        order.orderItems?.some((item) => item.productId?._id === product._id)
    );
  }, [userOrders, userInfo, product._id]);

  const handleWishlistToggle = () => {
    if (!userInfo) {
      toast.error("Please log in to add items to your wishlist.");
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
      toast.error("Please log in to download.");
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast.error("Please purchase this plan to download it.");
      navigate(linkTo);
      return;
    }
    if (!downloadFile) {
      toast.error("Download file is not available for this plan.");
      return;
    }

    let downloadUrl = downloadFile;
    if (downloadUrl.includes("res.cloudinary.com")) {
      const parts = downloadUrl.split("/upload/");
      if (parts.length === 2) {
        downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }

    try {
      toast.success("Your download is starting...");
      const link = document.createElement("a");
      link.href = downloadUrl;
      const fileExtension =
        downloadUrl.split(".").pop()?.split("?")[0] || "pdf";
      link.setAttribute(
        "download",
        `ArchHome-${productName.replace(/\s+/g, "-")}.${fileExtension}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download the file.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative p-2">
        <Link to={linkTo}>
          <img
            src={mainImage}
            alt={productName}
            className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
            <p>{plotSize}</p>
            <p className="text-xs font-normal">
              {hasPurchased ? "Download pdf file" : "Purchase to download"}
            </p>
          </div>
        </Link>
        {isSale && (
          <div className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
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

      <div className="p-4 grid grid-cols-3 gap-2 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{plotArea} sqft</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{rooms}</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{product.bathrooms || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{product.kitchen || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Floors</p>
          <p className="font-bold">{floors}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Direction</p>
          <p className="font-bold">{direction}</p>
        </div>
      </div>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">{category}</p>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {product.productNo && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Product No:</span>
              <span>{product.productNo}</span>
            </div>
          )}
          {city && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">City:</span>
              <span className="text-right font-bold text-teal-700">{city}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-teal-800 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          {isSale && regularPrice > 0 && (
            <s className="text-md text-gray-400">
              ₹{regularPrice.toLocaleString()}
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            ₹{displayPrice > 0 ? displayPrice.toLocaleString() : "N/A"}
          </span>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto space-y-2">
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
    </div>
  );
};

// --- हेल्पर कंपोनेंट 3: CountryCustomizationForm ---
const CountryCustomizationForm = ({ countryName }) => {
  // ... इसमें कोई बदलाव नहीं ...
};

// --- मुख्य Products कंपोनेंट ---
const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state: RootState) => state.user);

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
  const { orders: userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    category: categoryQuery || "all",
    searchTerm: searchQuery || "",
    plotSize: "all",
    plotArea: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [0, 50000],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 9;

  useEffect(() => {
    const apiParams: { [key: string]: any } = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "budget") {
        if (Array.isArray(value)) apiParams.budget = value.join("-");
      } else if (key === "searchTerm") {
        if (typeof value === "string" && value.trim()) apiParams.search = value;
      } else if (value !== "all") {
        apiParams[key] = value;
      }
    });
    dispatch(fetchProducts(apiParams));
    dispatch(fetchAllApprovedPlans(apiParams));
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, filters, userInfo]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryQuery || "all",
      searchTerm: searchQuery || "",
    }));
  }, [categoryQuery, searchQuery]);

  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    return [
      ...adminArray.map((p) => ({ ...p, source: "admin" })),
      ...profArray.map((p) => ({
        ...p,
        name: p.planName,
        image: p.mainImage,
        source: "professional",
      })),
    ];
  }, [adminProducts, professionalPlans]);

  const uniqueCategories = useMemo(() => {
    if (!combinedProducts) return [];
    const categoriesSet = new Set<string>();
    combinedProducts.forEach((p) => {
      const category =
        (Array.isArray(p.category) ? p.category.join(",") : p.category) ||
        p.Categories;
      if (category) {
        category.split(",").forEach((cat) => categoriesSet.add(cat.trim()));
      }
    });
    return Array.from(categoriesSet).sort();
  }, [combinedProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = combinedProducts.filter((product) => {
      if (
        !product ||
        (product.price === undefined && product["Regular price"] === undefined)
      )
        return false;

      const regularPrice =
        product.price !== 0 && product.price
          ? product.price
          : (product["Regular price"] ?? 0);
      const salePrice =
        product.salePrice !== 0 && product.salePrice
          ? product.salePrice
          : product["Sale price"];
      const isSale =
        product.isSale ?? (salePrice != null && salePrice < regularPrice);
      const displayPrice =
        isSale && salePrice != null ? salePrice : regularPrice;

      const productName = product.name || product.Name || "";
      const productCategory =
        (Array.isArray(product.category)
          ? product.category.join(" ")
          : product.category) ||
        product.Categories ||
        "";
      const plotSize =
        product.plotSize || product["Attribute 1 value(s)"] || "";
      const plotArea =
        product.plotArea ||
        (product["Attribute 2 value(s)"]
          ? parseInt(
              String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, "")
            )
          : 0);
      const direction =
        product.direction || product["Attribute 4 value(s)"] || "";
      const floors =
        product.floors ||
        (product["Attribute 5 value(s)"]
          ? parseInt(String(product["Attribute 5 value(s)"]))
          : 0);
      const propertyType = product.propertyType || "";
      const country = product.country || [];

      const matchesSearch =
        productName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        productCategory
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const matchesBudget =
        displayPrice >= filters.budget[0] && displayPrice <= filters.budget[1];
      const matchesCategory =
        filters.category === "all" ||
        productCategory.includes(filters.category);
      const matchesPlotSize =
        filters.plotSize === "all" || plotSize === filters.plotSize;
      const matchesPlotArea =
        filters.plotArea === "all" ||
        (filters.plotArea === "500-1000"
          ? plotArea >= 500 && plotArea <= 1000
          : filters.plotArea === "1000-2000"
            ? plotArea > 1000 && plotArea <= 2000
            : filters.plotArea === "2000+"
              ? plotArea > 2000
              : true);
      const matchesDirection =
        filters.direction === "all" || direction === filters.direction;
      const matchesFloors =
        filters.floors === "all" ||
        (filters.floors === "3+"
          ? floors >= 3
          : floors === parseInt(filters.floors, 10));
      const matchesPropertyType =
        filters.propertyType === "all" || propertyType === filters.propertyType;
      const matchesCountryQuery =
        !countryQuery ||
        (Array.isArray(country) && country.includes(countryQuery));

      return (
        matchesSearch &&
        matchesBudget &&
        matchesCategory &&
        matchesPlotSize &&
        matchesPlotArea &&
        matchesDirection &&
        matchesFloors &&
        matchesPropertyType &&
        matchesCountryQuery
      );
    });

    if (sortBy === "price-low") {
      products.sort((a, b) => {
        const priceA =
          (a.isSale ??
          (a["Sale price"] != null && a["Sale price"] < a["Regular price"]))
            ? (a.salePrice ?? a["Sale price"])
            : (a.price ?? a["Regular price"]);
        const priceB =
          (b.isSale ??
          (b["Sale price"] != null && b["Sale price"] < b["Regular price"]))
            ? (b.salePrice ?? b["Sale price"])
            : (b.price ?? b["Regular price"]);
        return (priceA ?? 0) - (priceB ?? 0);
      });
    } else if (sortBy === "price-high") {
      products.sort((a, b) => {
        const priceA =
          (a.isSale ??
          (a["Sale price"] != null && a["Sale price"] < a["Regular price"]))
            ? (a.salePrice ?? a["Sale price"])
            : (a.price ?? a["Regular price"]);
        const priceB =
          (b.isSale ??
          (b["Sale price"] != null && b["Sale price"] < b["Regular price"]))
            ? (b.salePrice ?? b["Sale price"])
            : (b.price ?? b["Regular price"]);
        return (priceB ?? 0) - (priceA ?? 0);
      });
    } else {
      products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return products;
  }, [combinedProducts, filters, countryQuery, sortBy]);

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

  const pageTitle = countryQuery
    ? `${countryQuery} House Plans`
    : "House Plans & Designs";
  const pageDescription = countryQuery
    ? `Browse plans available in ${countryQuery}`
    : "Discover our complete collection of architectural masterpieces";
  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>READYMADE HOME DESIGNS</title>
        <meta
          name="description"
          content="Browse readymade house plans and modern home designs with detailed layouts. Find affordable 2BHK, 3BHK, and duplex plans ready for instant download"
        />
      </Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground">{pageDescription}</p>
          {(countryQuery || categoryQuery || searchQuery) && (
            <div className="mt-4">
              <Link to="/products">
                <Button variant="destructive" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </Link>
            </div>
          )}
        </div>

        {countryQuery && (
          <CountryCustomizationForm countryName={countryQuery} />
        )}

        <div
          className={`flex flex-col lg:flex-row gap-12 ${countryQuery ? "pt-0 lg:pt-8" : "pt-0"}`}
        >
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            uniqueCategories={uniqueCategories}
          />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Plans</h2>
                <p className="text-gray-500 text-sm">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredAndSortedProducts.length} results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue />
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
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
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
                  Failed to Load Products
                </h3>
                <p className="mt-2 text-gray-500">{errorMessage}</p>
              </div>
            )}
            {!isLoading &&
              !isError &&
              filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold">No Plans Found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              )}

            {!isLoading && !isError && (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <ProductCard
                      key={`${product.source || "prod"}-${product._id}`}
                      product={product}
                      userOrders={userOrders}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <h3 className="text-xl font-semibold">No Products Found</h3>
                  </div>
                )}
              </div>
            )}

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
