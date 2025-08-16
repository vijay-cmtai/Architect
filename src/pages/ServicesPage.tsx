import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Navbar";
import {
  Users,
  PencilRuler,
  MessageSquare,
  FileCheck2,
  ChevronDown,
  CheckCircle,
  Star,
  Building2,
  Store,
  Factory,
} from "lucide-react";
const processSteps = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We start with a detailed discussion to understand your vision, requirements, and budget.",
    icon: <Users size={32} className="text-primary" />,
  },
  {
    step: "02",
    title: "Design & Draft",
    description:
      "Our expert architects create initial drafts and 3D models based on your inputs.",
    icon: <PencilRuler size={32} className="text-primary" />,
  },
  {
    step: "03",
    title: "Review & Refine",
    description:
      "We review the designs with you and make revisions until you are completely satisfied.",
    icon: <MessageSquare size={32} className="text-primary" />,
  },
  {
    step: "04",
    title: "Final Delivery",
    description:
      "You receive the complete, ready-to-use architectural files for your project.",
    icon: <FileCheck2 size={32} className="text-primary" />,
  },
];

const ProcessSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-dark">Our Design Process</h2>
        <p className="mt-2 text-lg text-dark-light">
          A simple, transparent, and collaborative journey from idea to reality.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {processSteps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="text-center p-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {item.icon}
              <span className="text-5xl font-light text-gray-300">
                {item.step}
              </span>
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">{item.title}</h3>
            <p className="text-dark-light">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
const standardPackages = [
  {
    title: "Floor Plan",
    price: "2",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
  },
  {
    title: "Floor Plan + 3D",
    price: "8",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: true,
  },
  {
    title: "Complete File",
    price: "10",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
  },
  {
    title: "Interior Designing",
    price: "20",
    unit: "Per sq.ft.",
    areaType: "Carpet Area",
    features: ["3D + 2D Drawings Included"],
    isPopular: false,
  },
];

const StandardPackagesSection = () => (
  <section className="py-20 bg-cyan-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-dark">Standard Packages</h2>
        <p className="mt-2 text-lg text-dark-light">
          Choose the plan that's right for you.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {standardPackages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white border-2 rounded-xl p-6 text-center transition-all duration-300 relative ${pkg.isPopular ? "border-primary shadow-2xl scale-105" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold text-dark mb-4">{pkg.title}</h3>
            <div className="mb-4">
              <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
              <p className="text-dark-light">{pkg.unit}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">{pkg.areaType}</p>
            {pkg.features && (
              <div className="text-left mt-4 text-sm space-y-2">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
const premiumPackages = [
  {
    title: "Floor Plan",
    price: "5",
    unit: "Per sq.ft.",
    features: ["3 Options", "Premium Quality"],
    isPopular: false,
  },
  {
    title: "Floor Plan + 3D",
    price: "12",
    unit: "Per sq.ft.",
    features: ["Premium Quality", "All Side Render", "Video Walkthrough"],
    isPopular: true,
  },
  {
    title: "Complete File + Interior",
    price: "30",
    unit: "Per sq.ft.",
    features: ["Everything Included", "Full Support"],
    areaType: "Built-up Area",
    isPopular: false,
  },
];

const PremiumPackagesSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-dark">Premium Packages</h2>
        <p className="mt-2 text-lg text-dark-light">
          Upgrade to a premium experience with more features.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {premiumPackages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white border-2 rounded-xl p-8 text-center transition-all duration-300 relative flex flex-col ${pkg.isPopular ? "border-primary shadow-2xl scale-105" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <Star size={12} fill="white" />
                <span>BEST VALUE</span>
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-dark mb-4">{pkg.title}</h3>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                <p className="text-dark-light">{pkg.unit}</p>
              </div>
              <div className="text-left mt-6 mb-8 text-base space-y-3">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {pkg.areaType && (
                <p className="text-sm text-gray-500 mb-6">{pkg.areaType}</p>
              )}
            </div>
            <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Select Premium Plan
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
const corporatePackages = [
  {
    title: "Builders & Colonizers",
    icon: <Building2 size={48} className="text-primary" />,
    description:
      "Comprehensive architectural solutions for large-scale housing and colony projects.",
    href: "/corporate/builders",
  },
  {
    title: "Offices & Shops",
    icon: <Store size={48} className="text-primary" />,
    description:
      "Modern and functional designs for commercial spaces, offices, and retail stores.",
    href: "/corporate/offices",
  },
  {
    title: "Factories & Educational",
    icon: <Factory size={48} className="text-primary" />,
    description:
      "Specialized plans for industrial buildings, schools, colleges, and other institutions.",
    href: "/corporate/factories",
  },
];

const CorporatePackagesSection = () => (
  <section className="py-20 bg-cyan-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-dark">
          Corporate Packages (Projects)
        </h2>
        <p className="mt-2 text-lg text-dark-light">
          Tailored solutions for your business and large-scale needs.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {corporatePackages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white border-2 border-transparent rounded-xl p-8 text-center flex flex-col items-center transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-2"
          >
            <div className="mb-6">{pkg.icon}</div>
            <h3 className="text-2xl font-bold text-dark mb-4">{pkg.title}</h3>
            <p className="text-dark-light flex-grow mb-6">{pkg.description}</p>
            <a
              href={pkg.href}
              className="mt-auto bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Learn More
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-dark">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden border"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-dark"
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
                      className="px-5 pb-5 text-dark-light"
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
  <section className="bg-primary py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 text-center text-white"
    >
      <h2 className="text-4xl font-bold mb-4">
        Ready to Build Your Dream Home?
      </h2>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Let's discuss your project. Contact us today for a free consultation and
        let our experts guide you.
      </p>
      <Link
        to="/contact"
        className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
      >
        Get a Free Quote
      </Link>
    </motion.div>
  </section>
);
const ServicesPage = () => {
  return (
    <>
    <Header/>
    <div className="bg-white">
      {/* Page Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-primary/90 text-white py-20 text-center"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-3">
            Our Services & Packages
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find the perfect architectural package that fits your needs, from
            standard plans to fully customized corporate solutions.
          </p>
        </div>
      </motion.section>
      <ProcessSection />
      <StandardPackagesSection />
      <PremiumPackagesSection />
      <CorporatePackagesSection />
      <FaqSection />
      <CtaSection />
    </div>
    <Footer/>
    </>
  );
};

export default ServicesPage;
