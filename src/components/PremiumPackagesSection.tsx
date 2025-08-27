import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom"; // Link pehle se imported hai, acchi baat hai!

const premiumPackages = [
  {
    title: "Premium Floor Plan", // Naam thoda unique rakha
    price: "5",
    unit: "Per sq.ft.",
    features: ["3 Options", "Premium Quality"],
    isPopular: false,
  },

  {
    title: "Premium Floor Plan + 3D", // Naam thoda unique rakha
    price: "12",
    unit: "Per sq.ft.",
    features: ["Premium Quality", "All Side Render", "Video Walkthrough"],
    isPopular: true,
  },
  {
    title: "Premium Complete File + Interior", // Naam thoda unique rakha
    price: "30",
    unit: "Per sq.ft.",
    features: ["Everything Included", "Full Support"],
    areaType: "Built-up Area",
    isPopular: false,
  },
];

const PremiumPackagesSection = () => {
  return (
    <section className="py-20 bg-soft-teal">
      {" "}
      {/* Color theme update ki gayi */}
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-card border-2 rounded-xl p-8 text-center transition-all duration-300 relative flex flex-col
                ${pkg.isPopular ? "border-primary shadow-lg scale-105" : "border-gray-200 hover:border-primary"}`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="white" />
                  <span>BEST VALUE</span>
                </div>
              )}

              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {pkg.title}
                </h3>

                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                  <p className="text-muted-foreground">{pkg.unit}</p>
                </div>

                <div className="text-left mt-6 mb-8 text-base space-y-3">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {pkg.areaType && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {pkg.areaType}
                  </p>
                )}
              </div>

              {/* ✨ YAHAN BADLAAV HAI: Button ab Booking Page ka Link hai aur state pass kar raha hai ✨ */}
              <Link
                to="/premium-booking-form"
                state={{ packageName: pkg.title }}
                className="w-full btn-primary text-center block mt-auto" // `mt-auto` zaroori hai
              >
                Select Premium Plan
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumPackagesSection;
