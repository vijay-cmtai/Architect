import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Filter,
  Grid,
  List,
  Heart,
  Eye,
  Youtube,
  Star,
  Download,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";
import { useWishlist } from "@/contexts/WishlistContext";

const allProducts = [
  {
    id: "1",
    name: "Modern Minimalist Villa",
    size: "3BHK - 2400 sqft",
    price: 99999,
    salePrice: 89999,
    image: house1,
    rating: 4.8,
    reviews: 124,
    isSale: true,
    hasVideo: true,
    youtubeLink: "https://www.youtube.com",
    plotSize: "40x60",
    plotArea: 2400,
    bhk: 3,
    direction: "North",
    floors: 2,
    propertyType: "Residential",
  },
  {
    id: "2",
    name: "Contemporary Family Home",
    size: "4BHK - 3200 sqft",
    price: 124999,
    image: house2,
    rating: 4.9,
    reviews: 89,
    isSale: false,
    hasVideo: false,
    plotSize: "50x64",
    plotArea: 3200,
    bhk: 4,
    direction: "East",
    floors: 2,
    propertyType: "Residential",
  },
  {
    id: "3",
    name: "Luxury Mediterranean Villa",
    size: "5BHK - 4500 sqft",
    price: 219999,
    salePrice: 199999,
    image: house3,
    rating: 4.7,
    reviews: 156,
    isSale: true,
    hasVideo: false,
    plotSize: "60x75",
    plotArea: 4500,
    bhk: 5,
    direction: "West",
    floors: 3,
    propertyType: "Residential",
  },
  {
    id: "4",
    name: "Compact Office Space",
    size: "1200 sqft",
    price: 109999,
    image: house1,
    rating: 4.8,
    reviews: 98,
    isSale: false,
    hasVideo: false,
    plotSize: "30x40",
    plotArea: 1200,
    bhk: 0,
    direction: "South",
    floors: 1,
    propertyType: "Commercial",
  },
  {
    id: "5",
    name: "Classic Colonial Style",
    size: "4BHK - 3600 sqft",
    price: 149999,
    image: house2,
    rating: 4.6,
    reviews: 67,
    isSale: false,
    hasVideo: false,
    plotSize: "60x60",
    plotArea: 3600,
    bhk: 4,
    direction: "East",
    floors: 2,
    propertyType: "Residential",
  },
  {
    id: "6",
    name: "Modern Retail Store",
    size: "1800 sqft",
    price: 89999,
    salePrice: 69999,
    image: house3,
    rating: 4.9,
    reviews: 203,
    isSale: true,
    hasVideo: true,
    youtubeLink: "https://www.youtube.com",
    plotSize: "30x60",
    plotArea: 1800,
    bhk: 0,
    direction: "North",
    floors: 1,
    propertyType: "Commercial",
  },
];

const Products = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [budget, setBudget] = useState([50000, 300000]);
  const [plotSize, setPlotSize] = useState("all");
  const [plotArea, setPlotArea] = useState("all");
  const [bhk, setBhk] = useState("all");
  const [direction, setDirection] = useState("all");
  const [floors, setFloors] = useState("all");
  const [propertyType, setPropertyType] = useState("all");

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const filteredProducts = allProducts.filter((product) => {
    const productPrice = product.isSale ? product.salePrice : product.price;
    const matchesBudget =
      productPrice >= budget[0] && productPrice <= budget[1];
    const matchesPlotSize = plotSize === "all" || product.plotSize === plotSize;
    const matchesPlotArea =
      plotArea === "all" ||
      (plotArea === "500-1000"
        ? product.plotArea >= 500 && product.plotArea <= 1000
        : plotArea === "1000-2000"
          ? product.plotArea > 1000 && product.plotArea <= 2000
          : plotArea === "2000+"
            ? product.plotArea > 2000
            : true);
    const matchesBhk = bhk === "all" || product.bhk === parseInt(bhk);
    const matchesDirection =
      direction === "all" || product.direction === direction;
    const matchesFloors =
      floors === "all" || product.floors === parseInt(floors);
    const matchesPropertyType =
      propertyType === "all" || product.propertyType === propertyType;
    return (
      matchesBudget &&
      matchesPlotSize &&
      matchesPlotArea &&
      matchesBhk &&
      matchesDirection &&
      matchesFloors &&
      matchesPropertyType
    );
  });

  const handleDownload = (imageUrl, productName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    const filename = `ArchHome-${productName.replace(/\s+/g, "-")}.jpg`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            House Plans & Designs
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover our complete collection of architectural masterpieces
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR FILTERS --- */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-card p-6 rounded-2xl shadow-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>

              {/* Plot Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Plot Size
                </label>
                <Select value={plotSize} onValueChange={setPlotSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plot Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="30x40">30x40</SelectItem>
                    <SelectItem value="40x60">40x60</SelectItem>
                    <SelectItem value="50x64">50x64</SelectItem>
                    <SelectItem value="60x60">60x60</SelectItem>
                    <SelectItem value="60x75">60x75</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Plot Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Plot Area (sqft)
                </label>
                <Select value={plotArea} onValueChange={setPlotArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plot Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="500-1000">500-1000</SelectItem>
                    <SelectItem value="1000-2000">1000-2000</SelectItem>
                    <SelectItem value="2000+">2000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Budget: ₹{budget[0].toLocaleString()} - ₹
                  {budget[1].toLocaleString()}
                </label>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  max={300000}
                  min={50000}
                  step={10000}
                />
              </div>

              {/* BHK */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  BHK
                </label>
                <Select value={bhk} onValueChange={setBhk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All BHK</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                    <SelectItem value="5">5 BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Direction */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Direction
                </label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
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

              {/* Floors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Floors
                </label>
                <Select value={floors} onValueChange={setFloors}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {allProducts.length}{" "}
                results
              </p>
              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            >
              {filteredProducts.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className={`bg-card rounded-2xl shadow-soft group transition-all duration-300 hover:shadow-medium hover:-translate-y-2 ${viewMode === "list" ? "flex" : ""}`}
                  >
                    <div
                      className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}
                    >
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "w-full h-full" : "w-full h-56"}`}
                        />
                      </Link>
                      {product.isSale &&
                        (product.hasVideo && product.youtubeLink ? (
                          <a
                            href={product.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 hover:bg-red-600 transition-colors"
                          >
                            <span>Sale!</span>
                            <Youtube size={14} />
                          </a>
                        ) : (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                            <span>Sale!</span>
                          </div>
                        ))}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => {
                            if (isWishlisted) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist(product);
                            }
                          }}
                          className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
                          aria-label="Toggle Wishlist"
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>
                        <Link
                          to={`/product/${product.id}`}
                          className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-sm"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    <div
                      className={`p-6 flex flex-col flex-1 ${viewMode === "list" ? "justify-between" : ""}`}
                    >
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {product.size}
                        </p>
                        <div className="flex items-center gap-1.5 mb-4">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {product.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-primary">
                            ₹
                            {product.isSale
                              ? product.salePrice.toLocaleString()
                              : product.price.toLocaleString()}
                          </span>
                          {product.isSale && (
                            <s className="text-sm text-muted-foreground">
                              ₹{product.price.toLocaleString()}
                            </s>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link to={`/product/${product.id}`}>
                            <Button className="w-full btn-primary">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              handleDownload(product.image, product.name)
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
