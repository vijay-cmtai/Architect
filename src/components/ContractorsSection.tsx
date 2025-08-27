import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchContractors } from "@/lib/features/users/userSlice";
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
import { MapPin, Star, Building, Phone, X, Send, Loader2 } from "lucide-react";

// Type definitions for contractors and modal props
type ContractorType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  phone?: string;
};

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
};

const contractorExperience = [
  "0-2 years",
  "2-5 years",
  "5-10 years",
  "10+ years",
];

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const inquiryData = {
      recipient: user._id,
      recipientInfo: {
        name: user.name,
        role: "Contractor",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: user.experience,
      },
      senderName: formData.get("name"),
      senderEmail: formData.get("email"),
      senderWhatsapp: formData.get("whatsapp"),
      requirements: formData.get("requirements"),
    };

    dispatch(createInquiry(inquiryData) as any).then((result: any) => {
      if (createInquiry.fulfilled.match(result)) {
        toast.success(`Your inquiry has been sent to ${user.name}!`);
        dispatch(resetActionStatus() as any);
        onClose();
      } else {
        toast.error(String(result.payload) || "An error occurred.");
        dispatch(resetActionStatus() as any);
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
                  Contact {user.name}
                </h2>
                <p className="text-gray-500">
                  Share your project details to get a quote.
                </p>
              </div>
              <button
                type="button"
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
                <Label htmlFor="requirements">Project Details</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="e.g., I need a contractor for a 2-story building..."
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

const ContractorsSection: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    address: "",
    experience: "all",
  });
  const [filteredContractors, setFilteredContractors] = useState<
    ContractorType[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);

  useEffect(() => {
    dispatch(fetchContractors() as any);
  }, [dispatch]);

  useEffect(() => {
    let currentContractors = Array.isArray(contractors)
      ? contractors
          .filter(
            (c: ContractorType) =>
              c.name?.toLowerCase().includes(filters.name.toLowerCase()) ||
              c.companyName?.toLowerCase().includes(filters.name.toLowerCase())
          )
          .filter((c: ContractorType) =>
            filters.city
              ? c.city?.toLowerCase().includes(filters.city.toLowerCase())
              : true
          )
          .filter((c: ContractorType) =>
            filters.address
              ? c.address?.toLowerCase().includes(filters.address.toLowerCase())
              : true
          )
      : [];
    if (filters.experience !== "all") {
      currentContractors = currentContractors.filter(
        (c: ContractorType) => c.experience === filters.experience
      );
    }
    setFilteredContractors(currentContractors.slice(0, 8));
  }, [filters, contractors]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };
  const handleFilterChange = (value: string, type: string) =>
    setFilters((p) => ({ ...p, [type]: value }));
  const clearFilters = () =>
    setFilters({ name: "", city: "", address: "", experience: "all" });

  return (
    <>
      <section className="py-20 bg-soft-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Hire Local Contractors
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find experienced contractors to bring your projects to life.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Label>Name / Company</Label>
              <Input
                placeholder="Search..."
                value={filters.name}
                onChange={(e) => handleFilterChange(e.target.value, "name")}
              />
            </div>
            <div className="col-span-1">
              <Label>City</Label>
              <Input
                placeholder="e.g., Pune"
                value={filters.city}
                onChange={(e) => handleFilterChange(e.target.value, "city")}
              />
            </div>
            <div className="col-span-1">
              <Label>Address / Area</Label>
              <Input
                placeholder="e.g., Hinjewadi"
                value={filters.address}
                onChange={(e) => handleFilterChange(e.target.value, "address")}
              />
            </div>
            <div className="col-span-1">
              <Label>Experience</Label>
              <Select
                value={filters.experience}
                onValueChange={(v) => handleFilterChange(v, "experience")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {contractorExperience.map((opt) => (
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
              type="button"
            >
              <X className="w-4 h-4 mr-2 lg:mr-0" />
              <span className="lg:hidden">Clear Filters</span>
            </Button>
          </div>

          {contractorListStatus === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          {contractorListStatus === "succeeded" &&
            (filteredContractors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredContractors.map((contractor) => (
                  <div
                    key={contractor._id}
                    className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2"
                  >
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-md">
                      <AvatarImage
                        src={contractor.photoUrl}
                        alt={contractor.name}
                      />
                      <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
                        {contractor.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center flex-grow">
                      <h3 className="font-bold text-lg text-gray-800">
                        {contractor.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm mt-1">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {contractor.companyName}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-sm text-left text-gray-500">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <span>
                            {contractor.address}, {contractor.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 shrink-0 text-primary" />
                          <span>{contractor.experience} Experience</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleContactClick(contractor)}
                      className="mt-4 w-full btn-primary h-10"
                      type="button"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Now
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                <p>No contractors found matching your criteria.</p>
              </div>
            ))}
        </div>
      </section>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedContractor}
      />
    </>
  );
};

export default ContractorsSection;
