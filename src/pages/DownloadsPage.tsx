import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Youtube,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
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
import { useWishlist } from "@/contexts/WishlistContext";
import house3 from "@/assets/house-3.jpg";
import { toast } from "sonner";

// --- ProductCard Component (UPDATED CODE) ---
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders: userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  const isWishlisted = isInWishlist(product._id);
  const linkTo =
    product.source === "admin"
      ? `/product/${product._id}`
      : `/professional-plan/${product._id}`;

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order) =>
        order.isPaid &&
        order.orderItems?.some(
          (item) =>
            item.productId === product._id ||
            item.productId?._id === product._id
        )
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

    const fileToDownload = Array.isArray(product.planFile)
      ? product.planFile[0]
      : product.planFile;

    if (!fileToDownload) {
      toast.error("Download file is not available for this plan.");
      return;
    }

    let downloadUrl = fileToDownload;

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
        `ArchHome-${product.name.replace(/\s+/g, "-")}.${fileExtension}`
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
            src={product.image || house3}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
            <p>{product.plotSize}</p>
          </div>
        </Link>
        {product.isSale && (
          <div className="absolute top-4 left-4 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Purchased
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
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

      {/* ✅✅ SECTION UPDATED: 3-column layout for compact details ✅✅ */}
      <div className="p-4 grid grid-cols-3 gap-2 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{product.plotArea || "N/A"} sqft</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">
            {product.rooms || product.bhk || "N/A"} BHK
          </p>
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
          <p className="font-bold">{product.floors || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Direction</p>
          <p className="font-bold">{product.direction || "N/A"}</p>
        </div>
      </div>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">
          {product.category || "House Plan"}
        </p>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {product.productNo && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Product No:</span>
              <span>{product.productNo}</span>
            </div>
          )}
          {product.city &&
            Array.isArray(product.city) &&
            product.city.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-semibold">City:</span>
                <span className="text-right font-bold text-teal-700">
                  {product.city.join(", ")}
                </span>
              </div>
            )}
        </div>
        <h3 className="text-lg font-bold text-teal-800 mt-1 truncate">
          {product.name}
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
          className={`w-full text-white rounded-md ${
            hasPurchased
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-gray-400 cursor-not-allowed"
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
  );
};

const Products = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const { products: adminProducts, listStatus: adminListStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { plans: professionalPlans, listStatus: profListStatus } = useSelector(
    (state: RootState) => state.professionalPlans
  );

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllApprovedPlans());
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, userInfo]);

  const combinedProducts = useMemo(() => {
    const adminArray = Array.isArray(adminProducts) ? adminProducts : [];
    const profArray = Array.isArray(professionalPlans) ? professionalPlans : [];
    const formattedAdmin = adminArray.map((p) => ({
      ...p,
      name: p.name,
      image: p.mainImage || p.image,
      source: "admin",
    }));
    const formattedProf = profArray.map((p) => ({
      ...p,
      name: p.planName,
      image: p.mainImage,
      source: "professional",
    }));
    return [...formattedAdmin, ...formattedProf];
  }, [adminProducts, professionalPlans]);

  const sortedProducts = useMemo(() => {
    const sorted = [...combinedProducts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort(
          (a, b) =>
            (a.isSale ? a.salePrice : a.price) -
            (b.isSale ? b.salePrice : b.price)
        );
      case "price-high":
        return sorted.sort(
          (a, b) =>
            (b.isSale ? b.salePrice : b.price) -
            (a.isSale ? a.salePrice : a.price)
        );
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [combinedProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / CARDS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + CARDS_PER_PAGE);
  }, [currentPage, sortedProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedProducts]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Plans</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm">
              Showing {paginatedProducts.length} of {sortedProducts.length}{" "}
              results
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={`${product.source}-${product._id}`}
                    product={product}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    No Plans Found
                  </h3>
                  <p className="mt-2 text-gray-500">Please check back later.</p>
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
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
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
