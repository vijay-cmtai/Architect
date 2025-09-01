// src/components/ContractorsSection.tsx

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  FC,
  ReactNode,
  FormEvent,
} from "react";
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
// FIX: Imported Select components for the new filter
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
  Star,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase, // Icon for profession
} from "lucide-react";

// Type definitions
type ContractorType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  phone?: string;
  profession?: string; // Add profession to the type
};

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
};

// FIX: Added an array for contractor sub-categories
const contractorSubCategories = [
  "General Contractor",
  "Civil Contractor",
  "Interior Contractor",
  "Electrical Contractor",
  "Plumbing Contractor",
];

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, user }) => {
  // ... (No changes needed in the ContactModal component)
  return <></>;
};

const ContractorsSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cityFilter, setCityFilter] = useState("");
  // FIX: Added new state for the sub-category filter
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const filteredContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];

    return contractors.filter((c: ContractorType) => {
      // City filter logic
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      // FIX: Sub-category filter logic
      const matchesSubCategory =
        subCategoryFilter === "all" || c.profession === subCategoryFilter;

      return matchesCity && matchesSubCategory;
    });
  }, [cityFilter, subCategoryFilter, contractors]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="py-20 bg-soft-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Hire Local Contractors
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find experienced contractors in your city to bring projects to
              life.
            </p>
          </div>

          {/* FIX: Updated filter section to include both filters */}
          <div className="max-w-2xl mx-auto mb-10 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="city-filter"
                className="font-semibold text-gray-700"
              >
                Filter by City
              </Label>
              <div className="relative mt-2">
                <Input
                  id="city-filter"
                  placeholder="e.g., Pune, Mumbai..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-10 h-12"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <Label
                htmlFor="subcategory-filter"
                className="font-semibold text-gray-700"
              >
                Filter by Profession
              </Label>
              <div className="relative mt-2">
                <Select
                  value={subCategoryFilter}
                  onValueChange={setSubCategoryFilter}
                >
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue placeholder="Select Profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                    {contractorSubCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {contractorListStatus === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {contractorListStatus === "succeeded" && (
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
                <div className="flex gap-8">
                  {filteredContractors.length > 0 ? (
                    filteredContractors.map((contractor) => (
                      <div
                        key={contractor._id}
                        className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2 w-72 flex-shrink-0 snap-start"
                      >
                        <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-md">
                          <AvatarImage
                            src={contractor.shopImageUrl}
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
                            {/* FIX: Display the contractor's profession */}
                            {contractor.profession && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 shrink-0 text-primary" />
                                <span>{contractor.profession}</span>
                              </div>
                            )}
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
                    ))
                  ) : (
                    <div className="w-full text-center py-12 text-gray-500 bg-white/50 rounded-xl">
                      <p>No contractors found matching your filters.</p>
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
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedContractor}
      />
    </>
  );
};

export default ContractorsSection;
