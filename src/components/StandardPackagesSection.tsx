import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom"; // Change 1: Import Link

const packages = [
  {
    title: "Floor Plan",
    price: "2",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/floor-plans", // Change 2: Add destination URL
  },
  {
    title: "Floor Plan + 3D",
    price: "8",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: true,
    linkTo: "/3d-plans", // Change 2: Add destination URL
  },
  {
    title: "Complete File",
    price: "10",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/construction-products", // Change 2: Add destination URL
  },
  {
    title: "Interior Designing",
    price: "20",
    unit: "Per sq.ft.",
    areaType: "Carpet Area",
    features: ["3D + 2D Drawings Included"],
    isPopular: false,
    linkTo: "/interior-designs", // Change 2: Add destination URL
  },
];

const StandardPackagesSection = () => {
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
          <h2 className="text-4xl font-bold text-dark">Standard Packages</h2>
          <p className="mt-2 text-lg text-dark-light">
            Choose the plan that's right for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white border-2 rounded-xl p-6 text-center transition-all duration-300 relative
                ${pkg.isPopular ? "border-primary shadow-2xl scale-105" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-dark mb-4">{pkg.title}</h3>

              <div className="mb-4">
                <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                <p className="text-dark-light">{pkg.unit}</p>
              </div>

              <p className="text-sm text-gray-500 mb-6">{pkg.areaType}</p>

              {pkg.features && (
                <div className="text-left mt-4 text-sm space-y-2">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Change 3: Replaced <button> with <Link> using the exact same classes */}
              <Link
                to={pkg.linkTo}
                className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors block"
              >
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandardPackagesSection;
