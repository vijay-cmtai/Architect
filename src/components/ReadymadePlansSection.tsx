import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutTemplate,
  Building2,
  Sofa,
  HardHat,
} from "lucide-react";

// FIX 1: Se han añadido propiedades de color para cada icono.
const planTypes = [
  {
    name: "Floor Plans",
    icon: LayoutTemplate,
    image: "/floorplan.jpg",
    href: "/floor-plans",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    name: "Floor Plan + 3D Elevations",
    icon: Building2,
    image: "/3d.jpg",
    href: "/3d-plans",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    name: "Interior Designs",
    icon: Sofa,
    image: "/homeDesign.jpg",
    href: "/interior-designs",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    name: "Construction Products",
    icon: HardHat,
    image: "/r4.avif",
    href: "/construction-products",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const ReadymadePlansSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* El título de la sección no ha cambiado */}
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
                {/* Imagen de fondo (sin cambios) */}
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Capa de gradiente (sin cambios) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                {/* Contenido (Icono + Texto) */}
                <div className="relative h-full flex flex-col p-6 text-white">
                  {/* --- ÁREA DEL ICONO --- */}
                  <div className="flex-grow flex items-center justify-center">
                    {/* FIX 2: Se ha añadido un 'div' contenedor para el fondo de color del icono. */}
                    <div
                      className={`p-6 rounded-full ${plan.bgColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <plan.icon
                        className={`h-16 w-16 ${plan.iconColor}`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* --- ÁREA DEL TEXTO (SIN CAMBIOS) --- */}
                  <div className="relative">
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
