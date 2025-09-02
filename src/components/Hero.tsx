import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedStat from "./AnimatedStat";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slides = [
  {
    image: "/b11.jpg",
    alt: "Modern white house with a lawn",
  },
  {
    image: "/b12.jpg",
    alt: "Classic house with a beautiful garden",
  },
  {
    image: "/b13.jpg",
    alt: "Luxurious apartment building exterior",
  },
  {
    image: "/b14.jpg",
    alt: "Luxurious apartment building Interior",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // ✨ Redux store se products aur unka status get karein ✨
  const { products, listStatus } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Agar products load nahi hain, to unhe fetch karein
    if (listStatus === "idle") {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, listStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ✨ Product list se unique categories nikalne ka logic ✨
  const uniqueCategories = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    // Set ka istemal karke sirf unique values nikalein
    const categories = new Set(
      products.map((product) => product.category).filter(Boolean)
    );
    return Array.from(categories).sort(); // Alphabetically sort karein
  }, [products]);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) {
      queryParams.append("category", selectedCategory);
    }
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    navigate(`/products?${queryParams.toString()}`);
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
          Find Your Perfect
          <span
            className="block text-white animate-bounce-in"
            style={{ animationDelay: "0.3s" }}
          >
            House Plan
          </span>
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 text-white/90 font-light animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          Discover amazing architectural designs for your dream home
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          <Link to="/products">
            <Button size="lg" className="btn-primary px-10 py-6 text-lg">
              Explore The Plans
            </Button>
          </Link>
        </motion.div>

        <div
          className="bg-white rounded-2xl p-4 shadow-large max-w-2xl mx-auto animate-scale-in"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {/* ✨ Category dropdown ab dynamic hai ✨ */}
              <Select
                onValueChange={setSelectedCategory}
                disabled={listStatus === "loading"}
              >
                <SelectTrigger className="w-full text-primary-gray border-0 focus:ring-2 focus:ring-primary transition-all duration-300 hover:bg-primary/5">
                  <SelectValue
                    placeholder={
                      listStatus === "loading"
                        ? "Loading..."
                        : "Select Category"
                    }
                  />
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
            <div className="flex-1">
              <Input
                placeholder="Search by plot size e.g., 21x30"
                className="border-0 focus:ring-2 focus:ring-primary text-primary-gray transition-all duration-300 hover:bg-primary/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="btn-primary md:px-8 group"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5 md:mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
          <AnimatedStat end={500} suffix="+" label="House Plans" />
          <AnimatedStat end={50} suffix="k+" label="Happy Customers" />
          <AnimatedStat end={15} suffix="+" label="Years Experience" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
