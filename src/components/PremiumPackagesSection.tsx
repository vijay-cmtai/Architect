// Example file path: src/components/home/PremiumPackagesSection.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const premiumPackages = [
  {
    title: "Floor Plan",
    price: "5",
    unit: "Per sqft",
    isPopular: false,
    features: [
      "3 plan option",
      "Furniture layout",
      "Landscaping",
      "Free vastu Consultant (Experienced)",
    ],
  },
  {
    title: "Floor plan + 3d Elevation",
    price: "12",
    unit: "Per sqft",
    isPopular: true,
    features: [
      "2 3D models",
      "3 Plan option",
      "Furniture layout",
      "Landscaping",
      "Free vastu Consultant (Experienced)",
    ],
  },
  {
    title: "Complete File",
    price: "40",
    unit: "Per sqft",
    isPopular: false,
    features: [
      "3 plan option",
      "2 3d model",
      "Works under vastu Expert",
      "With Interior Designing of Complete House",
    ],
  },
];

const PremiumPackageCard = ({ pkg, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allItems = pkg.features || [];
  const CONTENT_THRESHOLD = 4;
  const needsTruncation = allItems.length > CONTENT_THRESHOLD;
  const itemsToRender =
    needsTruncation && !isExpanded
      ? allItems.slice(0, CONTENT_THRESHOLD)
      : allItems;

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-card border-2 rounded-xl p-8 text-center transition-all duration-300 relative flex flex-col h-full
        ${pkg.isPopular ? "border-primary shadow-lg scale-105" : "border-gray-200 hover:border-primary"}`}
    >
      {pkg.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <Star size={12} fill="white" />
          <span>BEST VALUE</span>
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-foreground mb-4">{pkg.title}</h3>
        <div className="mb-6">
          <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
          <p className="text-muted-foreground">{pkg.unit}</p>
        </div>
        <div className="text-left mt-6 mb-8 text-base space-y-3">
          {itemsToRender.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary font-semibold text-sm -mt-4 mb-4 flex items-center justify-center w-full"
          >
            {isExpanded ? "Show Less" : "Show More..."}
            {isExpanded ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        )}
        {pkg.areaType && (
          <p className="text-sm text-muted-foreground mb-6">{pkg.areaType}</p>
        )}
      </div>

      {/* FIX: Se han añadido packageUnit y packagePrice al estado del Link */}
      <Link
        to="/premium-booking-form"
        state={{
          packageName: pkg.title,
          packageUnit: pkg.unit,
          packagePrice: pkg.price,
        }}
        className="w-full btn-primary text-center block mt-auto"
      >
        Select Premium Plan
      </Link>
    </motion.div>
  );
};

const PremiumPackagesSection = () => {
  return (
    <section className="py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Premium Packages
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Upgrade to a premium experience with more features.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {premiumPackages.map((pkg, index) => (
            <PremiumPackageCard key={index} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumPackagesSection;
