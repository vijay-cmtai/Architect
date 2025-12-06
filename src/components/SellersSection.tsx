import React, { useState, useEffect, useMemo, useRef, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  MapPin,
} from "lucide-react";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

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

// --- Inquiry Modal (No changes) ---
const InquiryModal = ({ product, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerInquiries
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `I am interested in your product: "${product.name}". Please provide more details.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Inquiry sent successfully! The seller will contact you soon."
      );
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send inquiry."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInquiry({ ...formData, productId: product._id }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Send Inquiry</h2>
          <p className="text-gray-500 mt-1">
            For product: <span className="font-semibold">{product.name}</span>
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- Product Card for Carousel (No changes) ---
const ProductCard = ({ product, onInquiryClick }) => (
  <div className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border hover:border-orange-500 hover:shadow-xl hover:-translate-y-2 w-80 flex-shrink-0 snap-start">
    <div className="relative">
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-800 flex items-center gap-1">
        <MapPin size={12} /> {product.city}
      </div>
    </div>
    <div className="pt-3 flex flex-col flex-grow">
      <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">
        {product.category}
      </p>
      <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
        {product.name}
      </h3>
      <div className="mt-auto pt-3">
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
        <div className="flex items-baseline justify-between mt-3">
          <span className="text-2xl font-extrabold text-gray-800">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={() => onInquiryClick(product)}
          className="w-full mt-3 bg-gray-800 hover:bg-orange-600 text-white font-semibold"
        >
          Send Inquiry
        </Button>
      </div>
    </div>
  </div>
);

// --- Main Carousel Section with Banner ---
const SellersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchPublicSellerProducts({
        limit: 15, // Fetch enough items for a carousel
        city: selectedCity || undefined,
      })
    );
  }, [dispatch, selectedCity]);

  const uniqueCategories = useMemo(() => {
    const categories = products.map((p) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set(categories)).sort()];
  }, [products]);

  const uniqueCities = useMemo(() => {
    const cities = products.map((p) => p.city).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cities)).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let items = products;
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.seller?.businessName?.toLowerCase().includes(searchLower)
      );
    }
    return items;
  }, [products, searchTerm, selectedCategory]);

  const handleOpenInquiryModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 344; // Card width (320px) + gap (24px)
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- BANNER ADDED HERE --- */}
          <div
            className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12 bg-cover bg-center"
            style={{ backgroundImage: "url(/marketplace.png)" }} // Make sure this image is in your /public folder
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4">
              <h2
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
                style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
              >
                Our Marketplace
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
                Discover amazing materials and designs for your dream home.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto border">
            <div className="md:col-span-1">
              <Label htmlFor="search-filter">Search Product or Seller</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search-filter"
                  placeholder="e.g., Cement, Tiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city-filter">City</Label>
              <Select
                value={selectedCity}
                onValueChange={(value) =>
                  setSelectedCity(value === "all-cities" ? "" : value)
                }
              >
                <SelectTrigger id="city-filter">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCities.map((city) => (
                    <SelectItem
                      key={city}
                      value={city === "All Cities" ? "all-cities" : city}
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          )}

          {status === "failed" && (
            <div className="text-center py-12">
              <ServerCrash className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Failed to Load Products
              </h3>
              <p className="text-gray-600">{String(error)}</p>
            </div>
          )}

          {status === "succeeded" && (
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onInquiryClick={handleOpenInquiryModal}
                      />
                    ))
                  ) : (
                    <div
                      className="w-full flex items-center justify-center text-center py-12 text-gray-500 bg-white/50 rounded-xl"
                      style={{ minWidth: "80vw" }}
                    >
                      <div>
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="font-semibold">
                          No products found matching your criteria.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </section>
      {isModalOpen && (
        <InquiryModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default SellersSection;
