import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchSellers } from "@/lib/features/users/userSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Briefcase,
  Phone,
  SlidersHorizontal,
  X,
  Send,
  Loader2,
} from "lucide-react";

const materialTypes = [
  "Cement & Steel",
  "Bricks & Blocks",
  "Paints",
  "Electricals & Plumbing",
  "Other",
];

// Contact Modal Component (Self-contained and Integrated)
const ContactModal = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const inquiryData = {
      recipient: user._id,
      recipientInfo: {
        name: user.businessName,
        role: "seller",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: user.materialType,
      },
      senderName: formData.get("name"),
      senderEmail: formData.get("email"),
      senderWhatsapp: formData.get("whatsapp"),
      requirements: formData.get("requirements"),
    };

    dispatch(createInquiry(inquiryData)).then((result) => {
      if (createInquiry.fulfilled.match(result)) {
        toast.success(`Your inquiry has been sent to ${user.businessName}!`);
        dispatch(resetActionStatus());
        onClose();
      } else {
        toast.error(String(result.payload) || "An error occurred.");
        dispatch(resetActionStatus());
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact {user.businessName}
                </h2>
                <p className="text-gray-500">
                  Share your requirements to get a quote.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="email">Your Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="+91..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="requirements">Your Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="e.g., I need 500 bags of cement..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {actionStatus === "loading" ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SellersSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const { sellers, sellerListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    address: "",
    materialType: "all",
  });
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  useEffect(() => {
    let currentSellers = Array.isArray(sellers)
      ? sellers
          .filter((s) =>
            s.businessName?.toLowerCase().includes(filters.name.toLowerCase())
          )
          .filter((s) =>
            s.city?.toLowerCase().includes(filters.city.toLowerCase())
          )
          .filter((s) =>
            s.address?.toLowerCase().includes(filters.address.toLowerCase())
          )
      : [];
    if (filters.materialType !== "all") {
      currentSellers = currentSellers.filter(
        (s) => s.materialType === filters.materialType
      );
    }
    setFilteredSellers(currentSellers.slice(0, 8));
  }, [filters, sellers]);

  const handleContactClick = (seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };
  const handleFilterChange = (value, type) =>
    setFilters((p) => ({ ...p, [type]: value }));
  const clearFilters = () =>
    setFilters({ name: "", city: "", address: "", materialType: "all" });

  return (
    <>
      <section className="py-20 bg-soft-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Find Material Suppliers
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with trusted material suppliers for every construction
              need.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Label>Business Name</Label>
              <Input
                placeholder="Search..."
                value={filters.name}
                onChange={(e) => handleFilterChange(e.target.value, "name")}
              />
            </div>
            <div className="col-span-1">
              <Label>City</Label>
              <Input
                placeholder="e.g., Jaipur"
                value={filters.city}
                onChange={(e) => handleFilterChange(e.target.value, "city")}
              />
            </div>
            <div className="col-span-1">
              <Label>Address / Area</Label>
              <Input
                placeholder="e.g., Sitapura"
                value={filters.address}
                onChange={(e) => handleFilterChange(e.target.value, "address")}
              />
            </div>
            <div className="col-span-1">
              <Label>Business Type</Label>
              <Select
                value={filters.materialType}
                onValueChange={(v) => handleFilterChange(v, "materialType")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {materialTypes.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full lg:w-auto"
            >
              <X className="w-4 h-4 mr-2 lg:mr-0" />
              <span className="lg:hidden">Clear Filters</span>
            </Button>
          </div>

          {sellerListStatus === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          {sellerListStatus === "succeeded" &&
            (filteredSellers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSellers.map((seller) => (
                  <div
                    key={seller._id}
                    className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2"
                  >
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-md">
                      <AvatarImage
                        src={seller.photoUrl}
                        alt={seller.businessName}
                      />
                      <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
                        {seller.businessName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center flex-grow">
                      <h3 className="font-bold text-lg text-gray-800">
                        {seller.businessName}
                      </h3>
                      <div className="mt-2 space-y-1.5 text-sm text-left text-gray-500">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <span>
                            {seller.address}, {seller.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 shrink-0 text-primary" />
                          <span>{seller.materialType}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleContactClick(seller)}
                      className="mt-4 w-full btn-primary h-10"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                <p>No sellers found matching your criteria.</p>
              </div>
            ))}
        </div>
      </section>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedSeller}
      />
    </>
  );
};

export default SellersSection;
