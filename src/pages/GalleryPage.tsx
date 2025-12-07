import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import useEmblaCarousel from "embla-carousel-react";
import {
  fetchGalleryItems,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Loader2,
  ServerCrash,
  CameraOff,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// --- Naya Carousel Card Component ---
const GalleryImageCard = ({
  items,
  onCardClick,
}: {
  items: GalleryItem[];
  onCardClick: () => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const firstItem = items[0];

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi && emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi && emblaApi.scrollNext();
    },
    [emblaApi]
  );

  return (
    <Card
      className="rounded-xl overflow-hidden group relative border-2 border-transparent hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
      onClick={onCardClick}
    >
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div className="flex-grow-0 flex-shrink-0 w-full" key={item._id}>
              <div className="aspect-square w-full bg-gray-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 pointer-events-none">
        <div className="transition-transform duration-300 transform group-hover:-translate-y-2">
          <h3 className="text-white font-bold text-lg drop-shadow-md">
            {firstItem.title}
          </h3>
          <p className="text-orange-300 text-sm font-semibold">
            {firstItem.category}
          </p>
          {items.length > 1 && (
            <p className="text-white/80 text-xs mt-1">{items.length} images</p>
          )}
        </div>
      </div>
    </Card>
  );
};

// --- Main Page Component ---
const GalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector(
    (state: RootState) => state.gallery
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GalleryItem[] | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  const uniqueCategories = useMemo(() => {
    if (!items) return [];
    const categories = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(categories), "Video"];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: GalleryItem[] } = {};
    filteredItems.forEach((item) => {
      const key = item.title.trim().toLowerCase();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return Object.values(groups).sort(
      (a, b) =>
        new Date(b[0].createdAt || 0).getTime() -
        new Date(a[0].createdAt || 0).getTime()
    );
  }, [filteredItems]);

  const totalPages = Math.ceil(groupedItems.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItemGroups = groupedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleCategoryChange = (value: string) => {
    if (value === "Video") {
      navigate("/customize/3d-video-walkthrough");
    } else {
      setSelectedCategory(value);
      setCurrentPage(1);
    }
  };

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const handleCardClick = (group: GalleryItem[]) => {
    setSelectedGroup(group);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (selectedGroup && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedGroup && currentImageIndex < selectedGroup.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-slate-600">Loading our gallery...</p>
        </div>
      );
    }
    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-red-50/50 p-8 rounded-xl">
          <ServerCrash className="h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-700">
            Oh no! Something went wrong
          </h3>
          <p className="mt-2 text-red-600">{String(error)}</p>
        </div>
      );
    }
    if (status === "succeeded" && currentItemGroups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-slate-100/50 p-8 rounded-xl">
          <CameraOff className="h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            No Images Found
          </h3>
          <p className="mt-2 text-slate-500">
            {selectedCategory === "All"
              ? "Our gallery seems to be empty at the moment."
              : `There are no images in the "${selectedCategory}" category.`}
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItemGroups.map((group, index) => (
            <GalleryImageCard
              key={`${group[0].title}-${index}`}
              items={group}
              onCardClick={() => handleCardClick(group)}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700">
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
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            <form onSubmit={handlePageJump} className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="Page..."
                className="w-20 h-10"
                aria-label="Jump to page"
              />
              <Button type="submit" variant="outline" className="h-10">
                Go
              </Button>
            </form>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-[#F7FAFA] min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Our Project Gallery
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore a collection of our best designs and projects. Get inspired
            for your next home.
          </p>
        </div>
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xs">
            <label className="block text-center text-sm font-medium text-slate-700 mb-2">
              Filter by category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-12 text-base bg-white shadow-sm border-slate-300 focus:ring-orange-500">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-base"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {renderContent()}
      </main>
      <Footer />

      {/* Full Screen Image Modal - Fixed Version */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl w-full max-h-[95vh] p-0 bg-black border-none overflow-hidden">
          {selectedGroup && (
            <>
              {/* Header with Close Button */}
              <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg">
                      {selectedGroup[currentImageIndex].title}
                    </h2>
                    <p className="text-orange-400 text-sm md:text-base font-semibold mt-1">
                      {selectedGroup[currentImageIndex].category}
                    </p>
                    {selectedGroup.length > 1 && (
                      <p className="text-white/80 text-xs md:text-sm mt-1">
                        Image {currentImageIndex + 1} of {selectedGroup.length}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm shrink-0"
                  >
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-20 md:py-24">
                <img
                  src={selectedGroup[currentImageIndex].imageUrl}
                  alt={
                    selectedGroup[currentImageIndex].altText ||
                    selectedGroup[currentImageIndex].title
                  }
                  className="max-w-full max-h-full object-contain"
                />

                {/* Navigation Buttons */}
                {selectedGroup.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 md:h-14 md:w-14 backdrop-blur-sm disabled:opacity-30 z-30"
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 md:h-14 md:w-14 backdrop-blur-sm disabled:opacity-30 z-30"
                      onClick={handleNextImage}
                      disabled={currentImageIndex === selectedGroup.length - 1}
                    >
                      <ChevronRight className="h-5 w-5 md:h-7 md:w-7" />
                    </Button>
                  </>
                )}
              </div>

              {/* Bottom Section with Thumbnails and Button */}
              <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/60 to-transparent pb-4 md:pb-6 pt-20">
                {/* Thumbnail Strip */}
                {selectedGroup.length > 1 && (
                  <div className="flex justify-center mb-4 px-4">
                    <div className="flex gap-2 bg-black/60 p-2 md:p-3 rounded-full backdrop-blur-sm overflow-x-auto max-w-full">
                      {selectedGroup.map((item, index) => (
                        <button
                          key={item._id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? "border-orange-500 scale-110"
                              : "border-white/30 hover:border-white/60"
                          }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.altText || item.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy Now Button */}
                {selectedGroup[currentImageIndex].productLink &&
                  selectedGroup[currentImageIndex].productLink.trim() !==
                    "" && (
                    <div className="flex justify-center px-4">
                      <Link
                        to={selectedGroup[currentImageIndex].productLink}
                        onClick={handleCloseModal}
                        className="w-full max-w-md"
                      >
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 md:px-8 py-4 md:py-6 text-base md:text-lg shadow-2xl rounded-full">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
