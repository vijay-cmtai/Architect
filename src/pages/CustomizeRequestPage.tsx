import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async"; // Helmet को import करें
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import RequestPageLayout from "../components/RequestPageLayout"; // Assuming a reusable layout component
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Reusable form styles from previous examples
export const formStyles = {
  label: "block text-sm font-semibold mb-2 text-gray-700",
  input:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  textarea:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100",
};

const CustomizeFloorPlanPage = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector((state) => state.customization);
  const [formKey, setFormKey] = useState(Date.now());

  // Form submission handler
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Floor Plan Customization"); // Specify request type
    dispatch(submitCustomizationRequest(formData));
  };

  // Effect to show success/error toasts
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now()); // Reset the form by changing its key
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  return (
    <>
      {/* --- Helmet Tag for SEO --- */}
      <Helmet>
        <title>
          Customize Your Floor Plan | Modern Layouts & Design Options
        </title>
        <meta
          name="description"
          content="Customize your floor plan with modern layouts and flexible design options. Easily create the perfect space to fit your needs—start personalizing your dream home today."
        />
      </Helmet>

      <Navbar />
      <main>
        <form key={formKey} onSubmit={handleSubmit}>
          <RequestPageLayout
            title="Customize Your Floor Plan"
            imageUrl="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            imageAlt="Modern living room with a floor plan design"
            isLoading={actionStatus === "loading"}
          >
            {/* Form Fields */}
            <div>
              <label htmlFor="name" className={formStyles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={formStyles.input}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={formStyles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={formStyles.input}
                required
              />
            </div>
            <div>
              <label htmlFor="whatsappNumber" className={formStyles.label}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                className={formStyles.input}
                required
              />
            </div>
            <div>
              <label htmlFor="plotSize" className={formStyles.label}>
                Your Plot Size (e.g., 30x40 ft)
              </label>
              <input
                type="text"
                id="plotSize"
                name="plotSize"
                className={formStyles.input}
                placeholder="e.g., 30x40 ft"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className={formStyles.label}>
                Describe Your Requirements
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell us about the number of rooms, style, Vastu needs, etc."
                className={formStyles.textarea}
                rows={5}
              ></textarea>
            </div>
            <div>
              <label className={formStyles.label}>
                Upload Reference File (Optional)
              </label>
              <input
                type="file"
                name="referenceFile"
                className={formStyles.fileInput}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can upload a hand sketch, image, or PDF file.
              </p>
            </div>
          </RequestPageLayout>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default CustomizeFloorPlanPage;
