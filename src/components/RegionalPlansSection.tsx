import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const regionalPlans = [
  {
    name: "America",
    image: "https://flagcdn.com/w320/us.png",
    href: "/plans/america",
  },
  {
    name: "Arabian",
    image: "https://flagcdn.com/w320/ae.png",
    href: "/plans/arabian",
  },
  {
    name: "Asia",
    image: "https://flagcdn.com/w320/jp.png",
    href: "/plans/asia",
  },
  {
    name: "Central America",
    image: "https://flagcdn.com/w320/mx.png",
    href: "/plans/central-america",
  },
  {
    name: "East Asia",
    image: "https://flagcdn.com/w320/kr.png",
    href: "/plans/east-asia",
  },
  {
    name: "India",
    image: "https://flagcdn.com/w320/in.png",
    href: "/plans/india",
  },
  {
    name: "North America",
    image: "https://flagcdn.com/w320/ca.png",
    href: "/plans/north-america",
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
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            House Plans by Region
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
            className="flex items-center gap-8 overflow-x-auto overflow-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {regionalPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 text-center w-64"
              >
                <Link to={plan.href} className="group">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-card p-2">
                    <img
                      src={plan.image}
                      alt={`${plan.name} flag`}
                      className="w-full h-48 object-contain"
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
