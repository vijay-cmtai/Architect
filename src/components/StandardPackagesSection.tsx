import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom"; // Link ko import karein

const packages = [
  {
    title: "Floor Plan",
    price: "2",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
  },
  {
    title: "Floor Plan + 3D",
    price: "8",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: true,
  },
  {
    title: "Complete File",
    price: "10",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
  },
  {
    title: "Interior Designing",
    price: "20",
    unit: "Per sq.ft.",
    areaType: "Carpet Area",
    features: ["3D + 2D Drawings Included"],
    isPopular: false,
  },
];

const StandardPackagesSection = () => {
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
            Standard Packages
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
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
              className={`bg-card border-2 rounded-xl p-6 text-center transition-all duration-300 relative flex flex-col
                ${pkg.isPopular ? "border-primary shadow-lg scale-105" : "border-gray-200 hover:border-primary"}`}
            >
              <div className="flex-grow">
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {pkg.title}
                </h3>

                <div className="mb-4">
                  <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                  <p className="text-muted-foreground">{pkg.unit}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {pkg.areaType}
                </p>

                {pkg.features && (
                  <div className="text-left mt-4 text-sm space-y-2">
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ✨ YAHAN BADLAAV HAI: Button ab ek Link hai jo state pass kar raha hai ✨ */}
              <Link
                to="/booking-form"
                state={{ packageName: pkg.title }}
                className="mt-6 w-full btn-primary text-center block" // `block` zaroori hai
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
