import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleDollarSign } from "lucide-react";

const RefundPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal min-h-screen">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-5 text-center bg-background"
        >
          <div className="container mx-auto px-4">
            <CircleDollarSign className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Refund Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Last updated: 18/03/2024
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-12 rounded-2xl shadow-lg space-y-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline"
            >
              <p>
                Thank you for choosing House Plan Files for your digital service
                needs. Please read this Refund Policy carefully before making a
                purchase. By purchasing and downloading digital files from our
                website, you acknowledge that you have read, understood, and
                agree to the terms outlined in this policy.
              </p>

              <h2 className="text-2xl font-bold">No Refunds</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Due to the nature of our digital services, which involve the
                  immediate delivery of downloadable files, we do not offer
                  refunds or exchanges for any purchases made on our website.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Non-Tangible Goods</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Our products are non-tangible digital goods delivered
                  electronically. Once you have downloaded the digital file, it
                  is deemed as “used” and cannot be returned or refunded.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Quality Assurance</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  We take pride in providing high-quality digital products and
                  ensure that they are accurately described on our website. We
                  encourage you to review product details and specifications
                  before making a purchase.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Customer Satisfaction</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Your satisfaction is important to us. If you encounter any
                  issues or have questions about our products, please contact
                  our customer support team, and we will do our best to assist
                  you.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Unauthorized Use</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If you believe that your account has been compromised or that
                  unauthorized purchases have been made, please notify us
                  immediately so that we can take appropriate action to secure
                  your account.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Changes to Refund Policy</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  We reserve the right to update or modify this Refund Policy at
                  any time without prior notice. Any changes will be effective
                  immediately upon posting on our website.
                </li>
              </ul>

              <h2 className="text-2xl font-bold">Contact Us</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If you have any questions or concerns about our Refund Policy,
                  please contact us at our{" "}
                  <Link to="/contact">Contact us page</Link>.
                </li>
              </ul>

              <p className="pt-4 border-t border-border">
                By making a purchase on our website, you agree to abide by this
                Refund Policy and acknowledge that no refunds will be provided
                for digital downloads.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
