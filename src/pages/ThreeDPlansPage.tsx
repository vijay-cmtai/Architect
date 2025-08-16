import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const threeDPlansData = [
  {
    id: "3d1",
    title: "14 X 40 SQFT HOUSE PLAN",
    image_3d:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
    image_2d:
      "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 4999,
    salePrice: 1499,
    category: "ASIAN HOUSE PLAN",
    size: "14*40 sqft",
    specs: {
      "Plot Area": "560 sq ft",
      Rooms: "2 BHK",
      Bathrooms: 2,
      Kitchen: 1,
    },
  },
  {
    id: "3d2",
    title: "25 X 20 SQFT HOUSE PLAN",
    image_3d:
      "https://images.pexels.com/photos/314937/pexels-photo-314937.jpeg?auto=compress&cs=tinysrgb&w=600",
    image_2d:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 4999,
    salePrice: 1499,
    category: "ASIAN HOUSE PLAN",
    size: "25*20 sqft",
    specs: {
      "Plot Area": "500 sq ft",
      Rooms: "3 BHK",
      Bathrooms: 2,
      Kitchen: 1,
    },
  },
  {
    id: "3d3",
    title: "33 X 60 SQFT HOUSE PLAN",
    image_3d:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
    image_2d:
      "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 4999,
    salePrice: 1999,
    category: "ASIAN HOUSE PLAN",
    size: "33*60 sqft",
    specs: {
      "Plot Area": "1980 sq ft",
      Rooms: "3 BHK",
      Bathrooms: 3,
      Kitchen: 1,
    },
  },
  {
    id: "3d4",
    title: "20 X 40 SQFT HOUSE PLAN",
    image_3d: "https://i.imgur.com/vH9jH62.png",
    image_2d: "https://i.imgur.com/N521rYg.png",
    price: 4999,
    salePrice: 1599,
    category: "ASIAN HOUSE PLAN",
    size: "20*40 sqft",
    specs: {
      "Plot Area": "800 sq ft",
      Rooms: "3 BHK",
      Bathrooms: 2,
      Kitchen: 1,
    },
  },
];

// --- इसी फाइल में शामिल कॉम्पोनेंट्स ---
const FilterSidebar = () => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-card rounded-xl shadow-lg h-fit border border-border">
    <div className="relative mb-6">
      <Input
        placeholder="Search by Floor, Area, etc..."
        className="pl-10 h-12 bg-input focus:bg-card"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </div>
    <div className="space-y-6">
      {[
        "Plot Area",
        "Plot Size",
        "Style",
        "Direction",
        "No. of Rooms",
        "No. of Kitchen",
        "No. of Floors",
        "No. of Bathrooms",
      ].map((filter) => (
        <div key={filter}>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            {filter}
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${filter}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-8">
        Filter
      </Button>
    </div>
  </aside>
);

const ProductCard = ({ plan }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem(plan);
    navigate("/cart");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl shadow-soft overflow-hidden border border-border flex flex-col group"
    >
      <div className="relative border-b border-border bg-gray-50 h-72 flex flex-col">
        <div className="w-full h-1/2 overflow-hidden">
          <img
            src={plan.image_3d}
            alt={`${plan.title} 3D View`}
            className="w-full h-full object-cover p-2"
          />
        </div>
        <div className="w-full h-1/2 overflow-hidden border-t border-dashed border-border">
          <img
            src={plan.image_2d}
            alt={`${plan.title} Floor Plan`}
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
          Sale!
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-sm text-foreground">
          {plan.title.toUpperCase()}
        </h3>
        <p className="text-xs text-muted-foreground">Download pdf file</p>
      </div>
      <div className="px-4 pb-4">
        <div className="my-2 grid grid-cols-2 gap-px bg-border overflow-hidden rounded-md">
          {Object.entries(plan.specs).map(([key, value]) => (
            <div key={key} className="bg-background p-2 text-center">
              <span className="font-semibold block capitalize text-xs text-muted-foreground">
                {key}
              </span>
              <span className="font-bold text-sm text-foreground">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border flex flex-col gap-2 mt-auto">
        <p className="text-xs text-muted-foreground text-center">
          {plan.category} • {plan.size}
        </p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-muted-foreground line-through">
            ₹{plan.price.toLocaleString()}
          </span>
          <span className="text-primary font-bold text-lg">
            ₹{plan.salePrice.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Add to cart
          </Button>
          <Button variant="outline" className="w-full">
            Download PDF
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ThreeDPlansPage = () => {
  const [sortBy, setSortBy] = useState("latest");
  return (
    <div className="bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <FilterSidebar />
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b border-border pb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  3D House Plans
                </h1>
                <p className="text-muted-foreground text-sm">
                  Showing {threeDPlansData.length} results
                </p>
              </div>
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Sort by latest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {threeDPlansData.map((plan) => (
                  <ProductCard key={plan.id} plan={plan} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default ThreeDPlansPage;
