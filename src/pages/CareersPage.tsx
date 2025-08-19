import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";

// Aapke handwritten note se job openings ka data
const jobOpenings = [
  {
    title: "Architect / Junior Architect",
    location: "Remote / On-site",
    type: "Full-time",
    description:
      "Design and develop architectural projects from concept to completion.",
  },
  {
    title: "Civil Structural Engineer",
    location: "On-site",
    type: "Full-time",
    description:
      "Analyze and design structural components for various construction projects.",
  },
  {
    title: "Civil Design Engineer",
    location: "On-site",
    type: "Full-time",
    description:
      "Create detailed civil engineering designs and plans for infrastructure projects.",
  },
  {
    title: "Interior Designer",
    location: "Remote / On-site",
    type: "Full-time",
    description:
      "Develop creative and functional interior design concepts for diverse spaces.",
  },
  {
    title: "Contractor",
    location: "Project-based",
    type: "Contract",
    description:
      "Oversee and manage construction projects, ensuring quality and timelines.",
  },
  {
    title: "Vastu Consultant",
    location: "Remote",
    type: "Part-time / Consultant",
    description:
      "Provide Vastu Shastra expertise to harmonize architectural designs.",
  },
  {
    title: "Site Engineer",
    location: "On-site",
    type: "Full-time",
    description:
      "Manage day-to-day operations on the construction site, ensuring quality control.",
  },
];

const CareersPage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-24 bg-soft-teal text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="container mx-auto px-4"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
              Join Our Team
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
              We are looking for passionate and talented individuals to help us
              shape the future of architecture.
            </p>
          </motion.div>
        </section>

        {/* Job Listings Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Current Openings
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-foreground">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@yourcompany.com?subject=Application for ${job.title}`}
                  >
                    <Button className="btn-primary w-full md:w-auto">
                      Apply Now
                    </Button>
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-4">
                Don't see a role that fits? We are always looking for great
                talent.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CareersPage;
