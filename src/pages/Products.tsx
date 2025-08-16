import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Grid, List, Heart, Eye, Youtube, Star } from "lucide-react"; // Youtube aur Star icon ko import karein
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

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([50000, 200000]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- 1. DATA MEIN NAYI PROPERTIES ADD KI GAYI HAIN ---
  const products = [
    {
      id: "1",
      name: "Modern Minimalist Villa",
      size: "3BHK - 2400 sqft",
      price: 99999,
      salePrice: 89999,
      image: house1,
      rating: 4.8,
      reviews: 124,
      category: "modern",
      isSale: true,
      hasVideo: true,
      youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_1",
    },
    {
      id: "2",
      name: "Contemporary Family Home",
      size: "4BHK - 3200 sqft",
      price: 124999,
      image: house2,
      rating: 4.9,
      reviews: 89,
      category: "contemporary",
      isSale: false,
      hasVideo: false,
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
      category: "luxury",
      isSale: true,
      hasVideo: false,
    },
    {
      id: "4",
      name: "Eco-Friendly Smart Home",
      size: "3BHK - 2800 sqft",
      price: 109999,
      image: house1,
      rating: 4.8,
      reviews: 98,
      category: "eco",
      isSale: false,
      hasVideo: false,
    },
    {
      id: "5",
      name: "Classic Colonial Style",
      size: "4BHK - 3600 sqft",
      price: 149999,
      image: house2,
      rating: 4.6,
      reviews: 67,
      category: "classic",
      isSale: false,
      hasVideo: false,
    },
    {
      id: "6",
      name: "Modern Townhouse",
      size: "2BHK - 1800 sqft",
      price: 89999,
      salePrice: 69999,
      image: house3,
      rating: 4.9,
      reviews: 203,
      category: "modern",
      isSale: true,
      hasVideo: true,
      youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_2",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const productPrice = product.isSale ? product.salePrice : product.price;
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

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
          <div className="lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                  {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={300000}
                  min={50000}
                  step={10000}
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="eco">Eco-Friendly</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Bedrooms
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((bed) => (
                    <Button
                      key={bed}
                      variant="outline"
                      size="sm"
                      className="h-10"
                    >
                      {bed}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} results
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
              {filteredProducts.map((product) => (
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

                    {/* --- 2. SALE & YOUTUBE BADGE LOGIC YAHAN ADD KIYA GAYA HAI --- */}
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
                      <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-sm">
                        <Heart className="w-5 h-5" />
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
                      <Link to={`/product/${product.id}`}>
                        <Button className="w-full btn-primary">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
