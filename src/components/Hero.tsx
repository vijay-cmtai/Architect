import { Link } from "react-router-dom"; // Link component navigation ke liye zaroori hai
import { motion } from "framer-motion";
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
import heroHouse from "@/assets/hero-house.jpg";

const Hero = () => {
  return (
    <section className="relative h-[700px] md:h-[650px] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroHouse}
          alt="Modern architectural house"
          className="w-full h-full object-cover animate-fade-in parallax"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
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

        {/* --- YEH BUTTON /products PAGE PAR LE JAYEGA --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          {/* <Link> tag button ko clickable banata hai */}
          <Link to="/products">
            <Button size="lg" className="btn-primary px-10 py-6 text-lg">
              Explore The Plans
            </Button>
          </Link>
        </motion.div>

        {/* Search Bar */}
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

        {/* Animated Stats */}
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
