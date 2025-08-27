import React from "react";
import { motion } from "framer-motion";

const logos = [
  {
    name: "Ultratech Cement",
    src: "https://upload.wikimedia.org/wikipedia/en/9/96/Ultratech_Cement_Logo.svg",
  },
  {
    name: "Ambuja Cement",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReqd2qw--8s6Jw_1vRDqrVptndwwgEYZMzeA&s",
  },
  {
    name: "Asian Paints",
    src: "https://images.seeklogo.com/logo-png/31/2/asian-paints-logo-png_seeklogo-315813.png",
  },
  {
    name: "Tata Steel",
    src: "https://www.tatasteel.com/media/3401/ts_logo_guidelines08.jpg",
  },
  { name: "JSW", src: "https://jswmi.in/jswm/storage/2020/04/jsw-logo-jv.png" },
  {
    name: "Havells",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ep_TvJk4fPcM8G4ObeaqVU8AmBZYLI6SkA&s",
  },
  {
    name: "Jaquar",
    src: "https://5.imimg.com/data5/ON/TY/DT/ANDROID-106823024/product-jpeg.jpeg",
  },
  {
    name: "Kajaria",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXbSooa46UVYmFQnwxlijEY_K5PiAe98g5XQ&s",
  },
  {
    name: "Cera",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnEN0W10k2IoD0nA1dAwZFi9qK8lnmYnpuBg&s",
  },
];

// Duplicate logos for a seamless loop
const extendedLogos = [...logos, ...logos];

const BrandPartnersSection: React.FC = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1600],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Brand Partners
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            We trust only the best for your home.
          </p>
        </motion.div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: [0, -1600],
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              },
            }}
          >
            {extendedLogos.map((logo, index) => (
              <div
                key={logo.name + index}
                className="flex-shrink-0 w-32 mx-8 flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-16 w-auto object-contain transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/128x64?text=Logo";
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandPartnersSection;
