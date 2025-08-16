import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Data for the plan types
const planTypes = [
  {
    name: "Floor\nPlans",
    image:
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/floor-plans",
  },
  {
    name: "Floor Plans +\n3D Elevation",
    image1:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
    image2:
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/3d-plans",
  },
  {
    name: "Interior\nDesigns",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/interior-designs",
  },
  {
    name: "Construction\nProducts",
    image:
      "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/construction-products",
  },
];

const ReadymadePlansSection = () => {
  return (
    // Section now uses the correct theme background
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title with theme-consistent colors */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Readymade House Plan
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {planTypes.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <Link to={plan.href}>
                <div className="mx-auto w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-lg border-4 border-card bg-card flex flex-col justify-center items-center group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                  {plan.image1 ? (
                    <>
                      <img
                        src={plan.image1}
                        alt="3D Elevation"
                        className="w-full h-1/2 object-cover"
                      />
                      <img
                        src={plan.image2}
                        alt="Floor Plan"
                        className="w-full h-1/2 object-cover"
                      />
                    </>
                  ) : (
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-6 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {plan.name.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadymadePlansSection;
