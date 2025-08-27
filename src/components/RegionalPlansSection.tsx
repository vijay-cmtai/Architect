import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// href ab /products page par query parameter ke saath point kar raha hai
const internationalPlans = [
  {
    name: "Mauritius",
    image: "https://flagcdn.com/w320/mu.png",
    href: "/products?country=Mauritius",
  },
  {
    name: "South Africa",
    image: "https://flagcdn.com/w320/za.png",
    href: "/products?country=South Africa",
  },
  {
    name: "Canada",
    image: "https://flagcdn.com/w320/ca.png",
    href: "/products?country=Canada",
  },
  {
    name: "Kenya",
    image: "https://flagcdn.com/w320/ke.png",
    href: "/products?country=Kenya",
  },
  {
    name: "Uganda",
    image: "https://flagcdn.com/w320/ug.png",
    href: "/products?country=Uganda",
  },
  {
    name: "Sudan",
    image: "https://flagcdn.com/w320/sd.png",
    href: "/products?country=Sudan",
  },
  {
    name: "Nigeria",
    image: "https://flagcdn.com/w320/ng.png",
    href: "/products?country=Nigeria",
  },
  {
    name: "Libya",
    image: "https://flagcdn.com/w320/ly.png",
    href: "/products?country=Libya",
  },
  {
    name: "Liberia",
    image: "https://flagcdn.com/w320/lr.png",
    href: "/products?country=Liberia",
  },
  {
    name: "Egypt",
    image: "https://flagcdn.com/w320/eg.png",
    href: "/products?country=Egypt",
  },
  {
    name: "Germany",
    image: "https://flagcdn.com/w320/de.png",
    href: "/products?country=Germany",
  },
  {
    name: "France",
    image: "https://flagcdn.com/w320/fr.png",
    href: "/products?country=France",
  },
  {
    name: "United Kingdom",
    image: "https://flagcdn.com/w320/gb.png",
    href: "/products?country=United Kingdom",
  },
  {
    name: "Iraq",
    image: "https://flagcdn.com/w320/iq.png",
    href: "/products?country=Iraq",
  },
  {
    name: "Oman",
    image: "https://flagcdn.com/w320/om.png",
    href: "/products?country=Oman",
  },
  {
    name: "Iran",
    image: "https://flagcdn.com/w320/ir.png",
    href: "/products?country=Iran",
  },
  {
    name: "Botswana",
    image: "https://flagcdn.com/w320/bw.png",
    href: "/products?country=Botswana",
  },
  {
    name: "Zambia",
    image: "https://flagcdn.com/w320/zm.png",
    href: "/products?country=Zambia",
  },
  {
    name: "Nepal",
    image: "https://flagcdn.com/w320/np.png",
    href: "/products?country=Nepal",
  },
  {
    name: "China",
    image: "https://flagcdn.com/w320/cn.png",
    href: "/products?country=China",
  },
  {
    name: "Singapore",
    image: "https://flagcdn.com/w320/sg.png",
    href: "/products?country=Singapore",
  },
  {
    name: "Indonesia",
    image: "https://flagcdn.com/w320/id.png",
    href: "/products?country=Indonesia",
  },
  {
    name: "Australia",
    image: "https://flagcdn.com/w320/au.png",
    href: "/products?country=Australia",
  },
  {
    name: "Vietnam",
    image: "https://flagcdn.com/w320/vn.png",
    href: "/products?country=Vietnam",
  },
  {
    name: "Thailand",
    image: "https://flagcdn.com/w320/th.png",
    href: "/products?country=Thailand",
  },
  {
    name: "Italy",
    image: "https://flagcdn.com/w320/it.png",
    href: "/products?country=Italy",
  },
  {
    name: "Brazil",
    image: "https://flagcdn.com/w320/br.png",
    href: "/products?country=Brazil",
  },
];

const RegionalPlansSection = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            International House Plans
          </h2>
          <div className="mt-4 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-lg hover:bg-muted transition duration-300"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="text-foreground" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-8 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.flex.items-center.gap-8.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
            {internationalPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 text-center w-52 md:w-64"
              >
                <Link to={plan.href} className="group">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-card p-2">
                    <img
                      src={plan.image}
                      alt={`${plan.name} flag`}
                      className="w-full h-36 md:h-48 object-contain"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {plan.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-card p-2 rounded-full shadow-lg hover:bg-muted transition duration-300"
            aria-label="Scroll Right"
          >
            <ChevronRight className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegionalPlansSection;
