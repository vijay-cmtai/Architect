import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// --- BADLAAV YAHAN KIYA GAYA HAI ---
// Logo URLs ko reliable links se replace kiya gaya hai.
const partners = [
  {
    name: "Microsoft",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/microsoft-4.svg",
  },
  {
    name: "Google",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/google-2015.svg",
  },
  {
    name: "Airbnb",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/airbnb-1.svg",
  },
  {
    name: "Spotify",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/spotify-1.svg",
  },
  {
    name: "Netflix",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
  },
  {
    name: "Amazon",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/amazon-2.svg",
  },
  {
    name: "Slack",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
  },
  {
    name: "Framer",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/framer-1.svg",
  },
  {
    name: "Vercel",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/vercel.svg",
  },
  {
    name: "Stripe",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
  },
];

const BrandPartnersSection = () => {
  return (
    <section className="py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Our Brand Partners
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We collaborate with the best in the industry to bring your vision to
            life.
          </p>
          <Link to="/contact" className="mt-8 inline-block">
            <Button size="lg" className="btn-primary">
              Join Us
            </Button>
          </Link>
        </motion.div>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <style>
            {`
              @keyframes infinite-scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-100%); }
              }
              .animate-infinite-scroll {
                animation: infinite-scroll 40s linear infinite;
              }
            `}
          </style>

          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
            {partners.map((partner, index) => (
              <li key={`partner-a-${index}`}>
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-10 md:max-h-12 w-auto object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </li>
            ))}
          </ul>
          <ul
            className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
            aria-hidden="true"
          >
            {partners.map((partner, index) => (
              <li key={`partner-b-${index}`}>
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-10 md:max-h-12 w-auto object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BrandPartnersSection;
