// PackagesPage.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // SEO ke liye
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StandardPackagesSection from "@/components/StandardPackagesSection";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import CorporatePackagesSection from "@/components/CorporatePackagesSection";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- FAQ aur CTA Sections ko yahan rakha gaya hai taaki page complete lage ---

const faqData = [
  {
    question: "How long does it take to get a house plan?",
    answer:
      "A standard readymade plan is delivered instantly. Custom plans typically take 2-4 weeks, depending on the complexity and number of revisions required.",
  },
  {
    question: 'What is included in the "Complete File" package?',
    answer:
      "The Complete File includes 2D floor plans, 3D elevations, structural drawings, electrical and plumbing layouts, and a bill of quantities. It's everything you need for construction.",
  },
  {
    question: "Can I make changes to a readymade plan?",
    answer:
      'Yes, you can! You can purchase a readymade plan and then opt for our "Customize Floor Plans" service to make modifications according to your needs.',
  },
  {
    question: "Do you provide construction services as well?",
    answer:
      "Currently, we specialize in architectural design and planning. We provide all the necessary drawings and support for your construction team, but we do not offer construction services directly.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card rounded-lg shadow-sm overflow-hidden border border-border"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-foreground"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-muted-foreground"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => (
  <section className="gradient-orange py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 text-center text-primary-foreground"
    >
      <h2 className="text-4xl font-bold mb-4">
        Ready to Build Your Dream Home?
      </h2>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Let's discuss your project. Contact us today for a free consultation and
        let our experts guide you.
      </p>
      <Link to="/contact">
        <Button
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-8 py-3 text-lg"
        >
          Get a Free Quote
        </Button>
      </Link>
    </motion.div>
  </section>
);

// --- Packages Page ka Main Component ---
const PackagesPage = () => {
  return (
    <>
      {/* --- SEO ke liye Helmet Tag --- */}
      <Helmet>
        <title>
          Architectural Design Packages | Standard, Premium & Corporate
        </title>
        <meta
          name="description"
          content="Explore our comprehensive design packages. We have a solution for every project, from standard 2D plans to large-scale corporate and commercial designs."
        />
      </Helmet>

      <Navbar />
      <main>
        {/* --- Hero Section - Text Updated for Packages --- */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="gradient-hero text-primary-foreground py-20 text-center"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold mb-3">
              Our Architectural Packages
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Find the perfect design package that fits your needs, from
              standard plans to fully customized corporate solutions.
            </p>
          </div>
        </motion.section>

        {/* --- Sirf Package Sections Yahan Dikhayenge --- */}
        <StandardPackagesSection />
        <PremiumPackagesSection />
        <CorporatePackagesSection />

        {/* --- Supporting Sections --- */}
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default PackagesPage;
