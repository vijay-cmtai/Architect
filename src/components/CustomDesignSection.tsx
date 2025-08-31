import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Se han importado todos los iconos necesarios
import { LayoutTemplate, Building2, Sofa, Video } from "lucide-react";

// FIX 1: Se ha mantenido la propiedad 'image' y se ha añadido 'icon', 'bgColor', y 'iconColor'.
const customServices = [
  {
    name: "Customize Floor Plans",
    description:
      "Tailor any floor plan to match your exact needs and lifestyle.",
    image:
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: LayoutTemplate,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    href: "/customize/floor-plans",
  },
  {
    name: "Customize 3D Elevation",
    description:
      "Modify the exterior look of your home with custom 3D renders.",
    image:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: Building2,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
    href: "/customize/3d-elevation",
  },
  {
    name: "Complete House Plan File",
    description:
      "Personalize your living spaces with our expert interior designers.",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: Sofa,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
    href: "/customize/interior-designs",
  },
  {
    name: "3D Video WalkThrough",
    description:
      "Experience your future home with immersive 3D video walkthroughs.",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    icon: Video,
    bgColor: "bg-red-100",
    iconColor: "text-red-500",
    href: "/customize/3d-video-walkthrough",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                  {/* FIX 2: El contenedor de la imagen ahora es 'relative' para superponer el icono. */}
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* FIX 3: Se ha añadido una capa para el icono superpuesto. */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30">
                      <div
                        className={`p-4 rounded-full ${service.bgColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <service.icon
                          className={`w-12 h-12 ${service.iconColor}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    {/* FIX 4: Se ha eliminado el icono pequeño que estaba aquí antes. */}
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
