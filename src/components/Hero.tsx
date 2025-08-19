import { useState, useEffect } from "react"; // useState aur useEffect ko import karein
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence ko import karein
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

// --- NAYI SLIDES KA DATA ---
// Aap yahan apni pasand ki images daal sakte hain
const slides = [
  {
    image:
      "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Modern white house with a lawn",
  },
  {
    image:
      "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Classic house with a beautiful garden",
  },
  {
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Luxurious apartment building exterior",
  },
];

const Hero = () => {
  // --- SLIDER KE LIYE LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Har 5 second mein slide badalne ke liye timer
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    // Component unmount hone par timer ko clear karein
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[700px] md:h-[650px] flex items-center justify-center text-white overflow-hidden">
      {/* --- BACKGROUND SLIDER --- */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={currentSlide} // Key badalne par hi AnimatePresence kaam karta hai
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Aapka purana content bilkul waisa hi hai */}
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
              <Select>
                <SelectTrigger className="w-full text-primary-gray border-0 focus:ring-2 focus:ring-primary transition-all duration-300 hover:bg-primary/5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern Homes</SelectItem>
                  <SelectItem value="villa">Luxury Villas</SelectItem>
                  <SelectItem value="apartment">Apartments</SelectItem>
                  <SelectItem value="farmhouse">Farmhouses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search house plans..."
                className="border-0 focus:ring-2 focus:ring-primary text-primary-gray transition-all duration-300 hover:bg-primary/5"
              />
            </div>
            <Button className="btn-primary md:px-8 group">
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
