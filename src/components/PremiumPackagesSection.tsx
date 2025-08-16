import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom"; 

const premiumPackages = [
  {
    title: "Floor Plan",
    price: "5",
    unit: "Per sq.ft.",
    features: ["3 Options", "Premium Quality"],
    isPopular: false,
    linkTo: "/floor-plans", 
  },
  {
    title: "Floor Plan + 3D",
    price: "12",
    unit: "Per sq.ft.",
    features: ["Premium Quality", "All Side Render", "Video Walkthrough"],
    isPopular: true,
    linkTo: "/3d-plans", 
  },
  {
    title: "Complete File + Interior",
    price: "30",
    unit: "Per sq.ft.",
    features: ["Everything Included", "Full Support"],
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/interior-designs", 
  },
];

const PremiumPackagesSection = () => {
  return (
    <section className="py-20 bg-cyan-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-dark">Premium Packages</h2>
          <p className="mt-2 text-lg text-dark-light">
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
              className={`bg-white border-2 rounded-xl p-8 text-center transition-all duration-300 relative flex flex-col
                ${pkg.isPopular ? "border-primary shadow-2xl scale-105" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="white" />
                  <span>BEST VALUE</span>
                </div>
              )}

              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-dark mb-4">
                  {pkg.title}
                </h3>

                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                  <p className="text-dark-light">{pkg.unit}</p>
                </div>

                <div className="text-left mt-6 mb-8 text-base space-y-3">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {pkg.areaType && (
                  <p className="text-sm text-gray-500 mb-6">{pkg.areaType}</p>
                )}
              </div>

              <Link
                to={pkg.linkTo}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors block"
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
