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

const constructionProductsData = [
  {
    id: "cp1",
    title: "WORK INSPECTION TEMPLATE",
    image:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 999,
    salePrice: 99,
    category: "Constructions",
    size: "Template",
    specs: { Type: "Checklist", Format: "PDF/Excel", Pages: 5, Usage: "Site" },
  },
  {
    id: "cp2",
    title: "DESIGN & BUILD AGREEMENT FORMAT",
    image:
      "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 999,
    salePrice: 299,
    category: "ASIAN HOUSE PLAN",
    size: "Document",
    specs: { Type: "Agreement", Format: "Word/PDF", Pages: 10, Usage: "Legal" },
  },
  {
    id: "cp3",
    title: "CONSTRUCTION CONTRACT FORMAT",
    image:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 1499,
    salePrice: 299,
    category: "ASIAN HOUSE PLAN",
    size: "Document",
    specs: { Type: "Contract", Format: "Word/PDF", Pages: 8, Usage: "Legal" },
  },
];

const FilterSidebar = () => (
  <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-card rounded-xl shadow-lg h-fit border border-border">
    <div className="relative mb-6">
      <Input
        placeholder="Search by name, type..."
        className="pl-10 h-12 bg-input focus:bg-card"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </div>
    <div className="space-y-6">
      {["Document Type", "Format", "Category"].map((filter) => (
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
      <div className="relative border-b border-border p-2 bg-gray-50">
        <img
          src={plan.image}
          alt={plan.title}
          className="w-full h-auto object-contain"
        />
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

const ConstructionProductsPage = () => {
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
                  Construction Products
                </h1>
                <p className="text-muted-foreground text-sm">
                  Showing {constructionProductsData.length} results
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
                {constructionProductsData.map((plan) => (
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

export default ConstructionProductsPage;
