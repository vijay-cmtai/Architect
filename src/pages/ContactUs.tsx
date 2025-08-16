import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <div className="bg-background text-foreground font-poppins w-full">
        {/* 1. Page Header */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="section-title">Get In Touch</h1>
            <p className="mt-12 max-w-3xl mx-auto text-lg text-muted-foreground">
              We're here to help you build your dream home. Reach out to us with
              any questions or to start your project.
            </p>
          </div>
        </section>

        {/* 2. Main Content Grid (Info + Form) */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Left Side: Contact Information */}
              <div className="lg:w-1/3">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="text-muted-foreground mb-8">
                  Fill up the form and our team will get back to you within 24
                  hours.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-primary h-6 w-6"
                    />
                    <div>
                      <p className="font-semibold">+91 12345 67890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary h-6 w-6"
                    />
                    <div>
                      <p className="font-semibold">hello@yourcompany.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-primary h-6 w-6 mt-1"
                    />
                    <div>
                      <p className="font-semibold">
                        123 Design Street, Architect Avenue, New Delhi, India -
                        110001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Form */}
              <div className="lg:w-2/3">
                <div className="bg-card p-8 rounded-lg shadow-lg">
                  <form action="#" method="POST">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-semibold mb-2"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-semibold mb-2"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      />
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        // rows="5"
                        className="w-full p-3 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      ></textarea>
                    </div>
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-md hover:bg-primary/90 transition-all duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Google Map Section */}
        <section>
          <div className="w-full h-96 md:h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.329235079632!2d77.21773357608889!3d28.62002778411218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd4a5c53996b%3A0x8f03125633364951!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1699525424597!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
