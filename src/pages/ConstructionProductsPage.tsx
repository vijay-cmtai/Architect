import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ServerCrash,
  Filter,
  Search,
  Download,
  Heart,
  Lock,
  User, // <-- ICONO AÑADIDO
  Mail, // <-- ICONO AÑADIDO
  Phone, // <-- ICONO AÑADIDO
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
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";

// --- Enhanced FilterSidebar Component ---
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
            setFilters((prev) => ({
              ...prev,
              budget: value as [number, number],
            }))
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

// --- Enhanced ProductCard Component with Authentication ---
const ProductCard = ({ plan, userOrders }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const isWishlisted = isInWishlist(plan._id);
  const linkTo =
    plan.source === "admin"
      ? `/product/${plan._id}`
      : `/professional-plan/${plan._id}`;

  const hasPurchased = userOrders?.some(
    (order) =>
      order.isPaid &&
      order.orderItems?.some(
        (item) =>
          item.productId === plan._id || item.productId?._id === plan._id
      )
  );

  const handleDownload = async () => {
    // ... (la lógica de descarga no cambia)
  };

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
            src={plan.mainImage || plan.image || house1}
            alt={plan.name}
            className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
            <p>Construction Product</p>
            <p className="text-xs font-normal">
              {hasPurchased ? "Download pdf file" : "Purchase to download"}
            </p>
          </div>
        </Link>
        {plan.isSale && (
          <div className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow">
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
            onClick={() =>
              isWishlisted ? removeFromWishlist(plan._id) : addToWishlist(plan)
            }
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              isWishlisted
                ? "text-red-500 scale-110"
                : "text-gray-600 hover:text-red-500 hover:scale-110"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{plan.plotArea || "N/A"} sqft</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{plan.rooms || plan.bhk || "N/A"} BHK</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{plan.bathrooms || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{plan.kitchen || "N/A"}</p>
        </div>
      </div>
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">
          {plan.category || "Construction Product"}
        </p>

        {/* --- INICIO DE LA SECCIÓN AÑADIDA --- */}
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {plan.productNo && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Product No:</span>
              <span>{plan.productNo}</span>
            </div>
          )}
          {plan.city && Array.isArray(plan.city) && plan.city.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">City:</span>
              <span className="text-right">{plan.city.join(", ")}</span>
            </div>
          )}
        </div>
        {/* --- FIN DE LA SECCIÓN AÑADIDA --- */}

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
      <div className="p-4 pt-0 mt-auto space-y-2">
        {/* --- INICIO DE LA SECCIÓN DE CONTACTO AÑADIDA --- */}
        {plan.contactDetails &&
          (plan.contactDetails.name ||
            plan.contactDetails.email ||
            plan.contactDetails.phone) && (
            <div className="mt-2 pt-3 border-t text-sm text-gray-700 space-y-2">
              <h4 className="font-semibold text-gray-800">Contact Supplier</h4>
              {plan.contactDetails.name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{plan.contactDetails.name}</span>
                </div>
              )}
              {plan.contactDetails.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a
                    href={`mailto:${plan.contactDetails.email}`}
                    className="text-blue-600 hover:underline truncate"
                  >
                    {plan.contactDetails.email}
                  </a>
                </div>
              )}
              {plan.contactDetails.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a
                    href={`tel:${plan.contactDetails.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {plan.contactDetails.phone}
                  </a>
                </div>
              )}
            </div>
          )}
        {/* --- FIN DE LA SECCIÓN DE CONTACTO AÑADIDA --- */}
        <div className="pt-2">
          {" "}
          {/* Wrapper para dar un pequeño espacio arriba de los botones */}
          <Link to={linkTo}>
            <Button
              variant="outline"
              className="w-full bg-gray-800 text-white hover:bg-gray-700"
            >
              Read more
            </Button>
          </Link>
          <Button
            className={`w-full text-white rounded-md mt-2 ${
              hasPurchased
                ? "bg-teal-500 hover:bg-teal-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
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

const ConstructionProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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
    category: "all",
    searchTerm: "",
    plotSize: "all",
    plotArea: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [0, 50000],
  });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const apiParams: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "budget") {
        apiParams.budget = value.join("-");
      } else if (key === "searchTerm") {
        if (value.trim()) apiParams.search = value;
      } else if (value !== "all") {
        apiParams[key] = value;
      }
    });
    apiParams.planType = "Construction Products";

    dispatch(fetchProducts(apiParams));
    dispatch(fetchAllApprovedPlans(apiParams));

    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, filters, userInfo]);

  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    const normalizedAdmin = adminArray.map((p) => ({
      ...p,
      name: p.name || "Unnamed",
      image: p.image || "",
      source: "admin",
    }));
    const normalizedProf = profArray.map((p) => ({
      ...p,
      name: p.planName || "Unnamed",
      image: p.mainImage || "",
      source: "professional",
    }));
    return [...normalizedAdmin, ...normalizedProf];
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
    return Array.from(categoriesSet).sort();
  }, [constructionProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = constructionProducts.filter((product) => {
      if (!product || typeof product.price === "undefined") return false;

      if (product.planType !== "Construction Products") return false;

      const productPrice = product.isSale ? product.salePrice : product.price;
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
      const matchesPlotArea =
        filters.plotArea === "all" ||
        (filters.plotArea === "500-1000"
          ? product.plotArea >= 500 && product.plotArea <= 1000
          : filters.plotArea === "1000-2000"
            ? product.plotArea > 1000 && product.plotArea <= 2000
            : filters.plotArea === "2000+"
              ? product.plotArea > 2000
              : true);
      const matchesDirection =
        filters.direction === "all" || product.direction === filters.direction;
      const matchesFloors =
        filters.floors === "all" ||
        product.floors === parseInt(filters.floors, 10);
      const matchesPropertyType =
        filters.propertyType === "all" ||
        product.propertyType === filters.propertyType;

      return (
        matchesSearch &&
        matchesBudget &&
        matchesCategory &&
        matchesPlotSize &&
        matchesPlotArea &&
        matchesDirection &&
        matchesFloors &&
        matchesPropertyType
      );
    });

    if (sortBy === "price-low") {
      products.sort(
        (a, b) =>
          (a.isSale ? a.salePrice : a.price) -
          (b.isSale ? b.salePrice : b.price)
      );
    } else if (sortBy === "price-high") {
      products.sort(
        (a, b) =>
          (b.isSale ? b.salePrice : b.price) -
          (a.isSale ? a.salePrice : a.price)
      );
    } else {
      products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return products;
  }, [constructionProducts, filters, sortBy]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";
  const isError = adminListStatus === "failed" || profListStatus === "failed";
  const errorMessage = String(adminError || profError);

  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            uniqueCategories={uniqueCategories}
          />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Construction Products
                </h1>
                <p className="text-gray-500 text-sm">
                  Showing {filteredAndSortedProducts.length} results
                </p>
              </div>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
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
                  Failed to Load Construction Products
                </h3>
                <p className="mt-2 text-gray-500">{errorMessage}</p>
              </div>
            )}

            {!isLoading &&
              !isError &&
              filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold">
                    No Construction Products Found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              )}

            {!isLoading && !isError && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((plan) => (
                    <ProductCard
                      key={`${plan.source}-${plan._id}`}
                      plan={plan}
                      userOrders={orders}
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
