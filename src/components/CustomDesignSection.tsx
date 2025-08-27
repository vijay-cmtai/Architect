import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react"; 

const customServices = [
  {
    name: "Customize Floor Plans",
    description:
      "Tailor any floor plan to match your exact needs and lifestyle.",
    image:
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/customize/floor-plans",
  },
  {
    name: "Customize 3D Elevation",
    description:
      "Modify the exterior look of your home with custom 3D renders.",
    image:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/customize/3d-elevation",
  },
  {
    name: "Customize Interior Designs",
    description:
      "Personalize your living spaces with our expert interior designers.",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/customize/interior-designs",
  },
];

const CustomDesignSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            We Design with Your Requirements
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* --- NEW CARD-BASED UI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {customServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={service.href}>
                <div className="bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <div className="inline-block p-3 mb-4 bg-primary/10 rounded-full">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
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

export default CustomDesignSection;
