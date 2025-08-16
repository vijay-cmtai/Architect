import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Custom services ka data
const customServices = [
  {
    name: "Customize\nFloor Plans",
    image:
      "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/customize/floor-plans",
  },
  {
    name: "Customize\n3D Elevation",
    image1:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600",
    image2:
      "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/customize/3d-elevation",
  },
  {
    name: "Customize\nInterior Designs",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/customize/interior-designs",
  },
];

const CustomDesignSection = () => {
  return (
    // === BADLAAV 1: Background color ko full-width karne ke liye isey section par lagaya gaya hai ===
    // 'bg-white' ko 'bg-cyan-50' se badla gaya hai.
    <section className="py-16 bg-cyan-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-dark">
            We Design with your Requirements
          </h2>
          <div className="mt-2 h-1 w-20 bg-primary mx-auto"></div>
        </motion.div>

        {/* === BADLAAV 2: Yahan se extra div hata diya gaya hai taaki grid seedhe container mein rahe === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {customServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <Link to={service.href}>
                <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white flex flex-col justify-center items-center group-hover:shadow-xl transition-shadow duration-300">
                  {service.image1 ? (
                    <>
                      <img
                        src={service.image1}
                        alt="3D Elevation"
                        className="w-full h-1/2 object-cover"
                      />
                      <img
                        src={service.image2}
                        alt="Floor Plan"
                        className="w-full h-1/2 object-cover"
                      />
                    </>
                  ) : (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-5 font-bold text-dark group-hover:text-primary transition-colors">
                  {service.name.split("\n").map((line, i) => (
                    <span
                      key={i}
                      className="block underline decoration-2 underline-offset-4"
                    >
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

export default CustomDesignSection;
