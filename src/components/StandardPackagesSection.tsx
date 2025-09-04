import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// El array de datos con todo el contenido de las tarjetas
const packages = [
  {
    title: "Floor Plan",
    price: "2",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
    features: [
      "Revision Unlimited upto satisfaction",
      "Requirements fixed",
      "General vastu follows",
      "24 Hours Delivery",
    ],
  },
  {
    title: "Floor Plan + 3D Elevation",
    price: "8",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: true,
    features: [
      "Plan Revision Unlimited upto satisfaction",
      "1 3D model on Reference",
      "Design & colour change flexibility",
      "Plan 24 Hours. Elevation 48 Hours Delivery",
    ],
  },
  {
    title: "Complete House Plan File",
    price: "Custom",
    unit: "Price",
    areaType: "",
    isPopular: false,
    includes: [
      "Floor plan",
      "3D Elevation + working plan",
      "Structural Detail plan",
      "Electrical Detail plan",
      "Plumbing Detail plan",
      "Sanitary Detail plan",
      "Door window Detail",
      "Staircase Detail",
    ],
    note: "Delivery in 3 working days after plan & elevation final. Condition Same as Package-2.",
  },
  {
    title: "Interior Design",
    price: "25",
    unit: "Per sq.ft.",
    areaType: "Carpet Area",
    isPopular: false,
    features: [
      "24 Hours Delivery",
      "Changes are accepted",
      "Revisions are accepted",
    ],
  },
];

const StandardPackagesSection = () => {
  return (
    <section className="py-16 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Standard Packages
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose the plan that's right for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-card border-2 rounded-xl p-4 text-center transition-all duration-300 relative flex flex-col
                ${pkg.isPopular ? "border-primary shadow-lg scale-105" : "border-gray-200 hover:border-primary"}`}
            >
              <div className="flex-grow">
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {pkg.title}
                </h3>

                <div className="mb-3">
                  <span className="text-4xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                  <p className="text-sm text-muted-foreground">{pkg.unit}</p>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {pkg.areaType}
                </p>

                {pkg.features && (
                  <div className="text-left mt-3 text-xs space-y-1">
                    {pkg.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle
                          size={14}
                          className="text-green-500 flex-shrink-0"
                        />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {pkg.includes && (
                  <div className="text-left mt-3 text-xs space-y-1">
                    <p className="font-bold text-foreground mb-1">Includes:</p>
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle
                          size={14}
                          className="text-green-500 flex-shrink-0"
                        />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {pkg.note && (
                  <div className="text-left mt-3 text-xs text-muted-foreground border-t pt-2 italic">
                    {pkg.note}
                  </div>
                )}
              </div>

              <Link
                to="/booking-form"
                state={{
                  packageName: pkg.title,
                  packageUnit: pkg.unit,
                  packagePrice: pkg.price,
                }}
                className="mt-4 w-full btn-primary text-center block text-sm py-2"
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
