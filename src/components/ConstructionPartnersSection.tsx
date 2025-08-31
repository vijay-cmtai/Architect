"use client"; // This component is interactive

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  FC,
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
} from "lucide-react";

// --- Type Definitions ---
type ContractorType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  phone?: string;
  profession?: string;
  status?: string;
};

// --- Contact Modal Component (Unchanged) ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
}> = ({ isOpen, onClose, user }) => {
  // ... (Modal logic and JSX remains the same as your previous version)
  return <></>;
};

// --- Main Section Component ---
const ConstructionPartnersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);
  // ++ CHANGE HERE: Added state for the city filter
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  // Filter for 'Approved' contractors and by city
  const approvedContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];

    return contractors.filter((c: ContractorType) => {
      const isApproved = c.status === "Approved";
      // ++ CHANGE HERE: Add city filtering logic
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());

      return isApproved && matchesCity;
    });
  }, [contractors, cityFilter]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
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
              Our Construction Partners
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with our network of trusted and approved contractors for
              your next project.
            </p>
          </div>

          {/* ++ CHANGE HERE: Added the city filter input section */}
          <div className="max-w-sm mx-auto mb-10 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md">
            <Label
              htmlFor="city-filter"
              className="font-semibold text-gray-700"
            >
              Filter by City
            </Label>
            <div className="relative mt-2">
              <Input
                id="city-filter"
                placeholder="e.g., Delhi, Mumbai..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-10 h-12"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {contractorListStatus === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {contractorListStatus === "succeeded" && (
            <div className="relative">
              {approvedContractors.length > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                    onClick={() => scroll("left")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                    onClick={() => scroll("right")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-8">
                  {approvedContractors.length > 0 ? (
                    approvedContractors.map((contractor) => (
                      <div
                        key={contractor._id}
                        className="bg-white rounded-xl p-4 flex flex-col group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2 w-72 flex-shrink-0 snap-start"
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
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 shrink-0 text-primary" />
                              <span>{contractor.profession}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 shrink-0 text-primary" />
                              <span>{contractor.experience} Experience</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                              <span>
                                {contractor.address}, {contractor.city}
                              </span>
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
                    ))
                  ) : (
                    <div className="w-full text-center py-12 text-gray-500 bg-white/50 rounded-xl">
                      <p>
                        No approved partners found for "{cityFilter}". Try
                        another city.
                      </p>
                    </div>
                  )}
                </div>
              </div>
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

export default ConstructionPartnersSection;
