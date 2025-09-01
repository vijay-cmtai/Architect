import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faHeart,
  faFileLines,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import Navbar from "./Navbar";

// Team member images - no change needed here
const teamMember1 =
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2787&auto=format&fit=crop";
const teamMember2 =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop";
const teamMember3 =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop";

// Hero background image
const heroBgImage =
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=3174&auto=format&fit=crop";

const AboutUs = () => {
  return (
    // Main container using theme colors from your config
    <>
      <Navbar />
      <div className="bg-background text-foreground font-poppins w-full overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="relative h-[60vh] w-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBgImage})` }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Story: Building Dreams, One Home at a Time
            </h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Our passion is turning your vision of a perfect home into an
              architectural reality.
            </p>
          </div>
        </section>

        {/* Wrapper for main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2. Our Journey Section */}
          <section className="py-16 md:py-24 text-center">
            <h2 className="section-title">Who We Are</h2>
            <p className="mt-12 max-w-4xl mx-auto text-lg leading-relaxed text-muted-foreground">
              Our journey began with a simple but powerful idea: to make
              exceptional home design accessible to everyone. We saw that many
              people struggled to find architectural plans that were both
              beautiful and practical. To solve this, we brought together a
              dedicated team of expert architects, engineers, and designers who
              share a commitment to quality, innovation, and client happiness.
              Today, with{" "}
              <strong className="text-foreground">
                15+ years of industry experience
              </strong>{" "}
              and the trust of over{" "}
              <strong className="text-foreground">
                50,000 happy customers
              </strong>
              , we have grown into a leading name for house plans and
              architectural services.
            </p>
          </section>

          {/* 3. Why Choose Us Section */}
          <section className="py-16 md:py-24">
            <h2 className="section-title text-center">What Sets Us Apart</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="feature-card">
                <FontAwesomeIcon
                  icon={faAward}
                  className="text-primary text-5xl mb-4"
                />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  15+ Years of Experience
                </h3>
                <p className="text-muted-foreground">
                  Our deep industry knowledge ensures every design is timeless,
                  functional, and built to the highest standards.
                </p>
              </div>
              <div className="feature-card">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-primary text-5xl mb-4"
                />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  50k+ Happy Customers
                </h3>
                <p className="text-muted-foreground">
                  The satisfaction of our clients is our biggest achievement. We
                  are proud to have helped over 50,000 families.
                </p>
              </div>
              <div className="feature-card">
                <FontAwesomeIcon
                  icon={faFileLines}
                  className="text-primary text-5xl mb-4"
                />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  500+ Unique House Plans
                </h3>
                <p className="text-muted-foreground">
                  Our extensive library offers a diverse range of styles and
                  sizes, ensuring you’ll find a design that feels like home.
                </p>
              </div>
              <div className="feature-card">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-primary text-5xl mb-4"
                />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  An Expert Team
                </h3>
                <p className="text-muted-foreground">
                  Our team is our greatest asset. We are passionate
                  professionals dedicated to providing you with the best design
                  expertise.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Mission & Vision Section */}
          <section className="py-16 md:py-24">
            <div className="mt-12 flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-card p-8 rounded-lg border-l-4 border-primary shadow-md">
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To simplify the process of building a home by providing
                  inspiring, high-quality, and customizable architectural plans
                  that empower our clients to create a space that truly reflects
                  their personality and lifestyle.
                </p>
              </div>
              <div className="flex-1 bg-card p-8 rounded-lg border-l-4 border-primary shadow-md">
                <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and customer-centric platform for
                  architectural design, known for our creativity, integrity, and
                  unwavering commitment to bringing dream homes to life across
                  the nation.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Meet The Team Section */}
          <section className="py-16 md:py-24 text-center">
            <h2 className="section-title">The Minds Behind the Designs</h2>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              <div className="team-member">
                <img
                  src={teamMember1}
                  alt="Lead Architect"
                  className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <h4 className="text-xl font-bold mt-6 mb-1">Johnathan Doe</h4>
                <span className="text-primary font-medium">Lead Architect</span>
              </div>
              <div className="team-member">
                <img
                  src={teamMember2}
                  alt="Head of Interior Design"
                  className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <h4 className="text-xl font-bold mt-6 mb-1">Jane Smith</h4>
                <span className="text-primary font-medium">
                  Head of Interior Design
                </span>
              </div>
              <div className="team-member">
                <img
                  src={teamMember3}
                  alt="Client Relations Manager"
                  className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <h4 className="text-xl font-bold mt-6 mb-1">David Chen</h4>
                <span className="text-primary font-medium">
                  Client Relations Manager
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 6. Call to Action Section */}
        <section className="bg-primary text-primary-foreground py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8">
              Let's build something amazing together. Explore our plans or
              contact our team.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {/* Note: If you have a Button component from a library, use it here. */}
              <button className="px-8 py-3 rounded-md font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors">
                Browse House Plans
              </button>
              <button className="px-8 py-3 rounded-md font-semibold border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
