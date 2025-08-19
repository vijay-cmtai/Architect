import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Users,
  MessageSquare,
  FileEdit,
  ChevronDown,
  CheckCircle,
  Star,
  Building2,
  Store,
  Factory,
  PhoneCall,
  ClipboardCheck,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Section 1: Naya Process Section (Aapke handwritten note ke anusaar)
const processSteps = [
  {
    icon: PhoneCall,
    title: "Consultation",
    description:
      "We start with a detailed call to understand your vision, requirements, and budget perfectly.",
  },
  {
    icon: Users,
    title: "WhatsApp Group",
    description:
      "A dedicated WhatsApp group is created for seamless communication between you and our design team.",
  },
  {
    icon: MessageSquare,
    title: "Discussion",
    description:
      "We collaborate and brainstorm ideas, refining the concept based on your valuable feedback.",
  },
  {
    icon: FileEdit,
    title: "Drafting",
    description:
      "Our expert architects create initial drafts, including 2D floor plans and 3D models for your review.",
  },
  {
    icon: ClipboardCheck,
    title: "Correction",
    description:
      "We incorporate all your suggestions and make necessary revisions to perfect every detail of the design.",
  },
  {
    icon: Trophy,
    title: "Final Delivery",
    description:
      "Once you are completely satisfied, we deliver the final, ready-to-use architectural files for your dream home.",
  },
];

const ProcessSection = () => (
  <section className="py-20 bg-soft-teal">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Design Process
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A simple, transparent, and collaborative journey from idea to final
          plan.
        </p>
      </motion.div>
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-6 md:left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative mb-12"
          >
            <div className="flex items-center">
              <div className="absolute left-6 md:left-1/2 top-1 z-10 -translate-x-1/2 w-12 h-12 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="w-full ml-20 md:ml-0 md:w-5/6 md:mx-auto">
                <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 2: Standard Packages
const standardPackages = [
  {
    title: "Floor Plan",
    price: "2",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/customize/floor-plans",
  },
  {
    title: "Floor Plan + 3D",
    price: "8",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: true,
    linkTo: "/customize/3d-elevation",
  },
  {
    title: "Complete File",
    price: "10",
    unit: "Per sq.ft.",
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/products",
  },
  {
    title: "Interior Designing",
    price: "20",
    unit: "Per sq.ft.",
    areaType: "Carpet Area",
    features: ["3D + 2D Drawings Included"],
    isPopular: false,
    linkTo: "/customize/interior-designs",
  },
];

const StandardPackagesSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-foreground">
          Standard Packages
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
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
            className={`bg-card border-2 rounded-xl p-6 text-center transition-all duration-300 relative ${pkg.isPopular ? "border-primary shadow-orange -translate-y-2" : "border-border hover:border-primary hover:shadow-medium"}`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {pkg.title}
            </h3>
            <div className="mb-4">
              <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
              <p className="text-muted-foreground">{pkg.unit}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{pkg.areaType}</p>
            {pkg.features && (
              <div className="text-left mt-4 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-accent" />
                  <span>{pkg.features[0]}</span>
                </div>
              </div>
            )}
            <Link to={pkg.linkTo}>
              <Button className="mt-6 w-full btn-primary">Choose Plan</Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 3: Premium Packages
const premiumPackages = [
  {
    title: "Floor Plan",
    price: "5",
    features: ["3 Options", "Premium Quality"],
    isPopular: false,
    linkTo: "/customize/floor-plans",
  },
  {
    title: "Floor Plan + 3D",
    price: "12",
    features: ["Premium Quality", "All Side Render", "Video Walkthrough"],
    isPopular: true,
    linkTo: "/customize/3d-elevation",
  },
  {
    title: "Complete File + Interior",
    price: "30",
    features: ["Everything Included", "Full Support"],
    areaType: "Built-up Area",
    isPopular: false,
    linkTo: "/customize/interior-designs",
  },
];

const PremiumPackagesSection = () => (
  <section className="py-20 bg-soft-teal">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-foreground">Premium Packages</h2>
        <p className="mt-2 text-lg text-muted-foreground">
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
            className={`bg-card border-2 rounded-xl p-8 text-center transition-all duration-300 relative flex flex-col ${pkg.isPopular ? "border-primary shadow-orange -translate-y-2" : "border-border hover:border-primary hover:shadow-medium"}`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <Star size={12} className="fill-current" />
                <span>BEST VALUE</span>
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {pkg.title}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                <p className="text-muted-foreground">Per sq.ft.</p>
              </div>
              <div className="text-left mt-6 mb-8 text-base space-y-3">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-accent" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {pkg.areaType && (
                <p className="text-sm text-muted-foreground mb-6">
                  {pkg.areaType}
                </p>
              )}
            </div>
            <Link to={pkg.linkTo}>
              <Button className="w-full btn-primary mt-auto">
                Select Premium Plan
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 4: Corporate Packages
const corporatePackages = [
  {
    title: "Builders & Colonizers",
    icon: <Building2 size={48} className="text-primary" />,
    description:
      "Comprehensive architectural solutions for large-scale housing and colony projects.",
    slug: "builders-colonizers",
  },
  {
    title: "Offices & Shops",
    icon: <Store size={48} className="text-primary" />,
    description:
      "Modern and functional designs for commercial spaces, offices, and retail stores.",
    slug: "offices-shops",
  },
  {
    title: "Factories & Educational",
    icon: <Factory size={48} className="text-primary" />,
    description:
      "Specialized plans for industrial buildings, schools, colleges, and other institutions.",
    slug: "factories-educational",
  },
];

const CorporatePackagesSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-foreground">
          Corporate Packages (Projects)
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
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
            className="bg-card border-2 border-transparent rounded-xl p-8 text-center flex flex-col items-center transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-2"
          >
            <div className="mb-6">{pkg.icon}</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {pkg.title}
            </h3>
            <p className="text-muted-foreground flex-grow mb-6">
              {pkg.description}
            </p>
            <Link to={`/corporate-inquiry/${pkg.slug}`} className="mt-auto">
              <Button className="btn-primary">Learn More</Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 5: FAQ
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleToggle = (index: number) =>
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

// Section 6: Call to Action
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

// Final Services Page Component
const ServicesPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="gradient-hero text-primary-foreground py-20 text-center"
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
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
