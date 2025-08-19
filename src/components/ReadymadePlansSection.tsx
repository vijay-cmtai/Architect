import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // A nice icon for user guidance

// Data for the plan types with updated, more descriptive images
const planTypes = [
  {
    name: "Floor Plans",
    image:
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/floor-plans",
  },
  {
    name: "3D Elevations",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/3d-plans",
  },
  {
    name: "Interior Designs",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/interior-designs",
  },
  {
    name: "Construction Products",
    image:
      "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/construction-products",
  },
];

const ReadymadePlansSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title remains the same */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Readymade House Plans
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* --- NEW CARD-BASED UI --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {planTypes.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={plan.href}
                className="group block relative rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 aspect-[3/4]"
              >
                {/* Background Image */}
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300"></div>

                {/* Content with Text and Icon */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-primary-foreground/80 opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadymadePlansSection;
