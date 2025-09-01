// src/pages/ThreeDWalkthroughPage.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// FIX 1: Se eliminaron los tipos 'RootState' y 'store' que son de TypeScript.
import { toast } from "sonner";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import RequestPageLayout from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Asumiendo que formStyles se exporta desde tu componente de layout
export const formStyles = {
  label: "block text-sm font-semibold mb-2 text-gray-700",
  input:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  select:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  textarea:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100",
};

// FIX 2: Se eliminó la anotación de tipo ': React.FC'
const ThreeDWalkthroughPage = () => {
  const dispatch = useDispatch();
  // FIX 3: Se eliminó la anotación de tipo ': RootState'
  const { actionStatus, error } = useSelector((state) => state.customization);

  // FIX 4: Se eliminó el genérico '<number>' de useState
  const [formKey, setFormKey] = useState(Date.now());

  // FIX 5: Se eliminó el tipo del evento
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Video Walkthrough");

    // FIX 6: Se eliminó la aserción de tipo
    dispatch(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now()); // Reiniciar el formulario
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  return (
    <>
      <Navbar />
      <form key={formKey} onSubmit={handleSubmit}>
        <RequestPageLayout
          title="Request a 3D Video Walkthrough"
          imageUrl="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          imageAlt="Example of a 3D house walkthrough"
          isLoading={actionStatus === "loading"}
        >
          {/* Campos del formulario */}
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

          {/* FIX 7: Se añadió el campo 'country' que faltaba */}
          <div>
            <label htmlFor="country" className={formStyles.label}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className={formStyles.input}
              defaultValue="India"
              required
            />
          </div>

          <div>
            <label htmlFor="projectScope" className={formStyles.label}>
              Project Scope (e.g., Number of Floors)
            </label>
            <input
              type="text"
              id="projectScope"
              name="projectScope"
              className={formStyles.input}
              placeholder="e.g., G+1, 2000 sqft"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className={formStyles.label}>
              Describe your Vision
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="e.g., I want to showcase the flow from the living room to the kitchen..."
              className={formStyles.textarea}
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className={formStyles.label}>
              Upload Existing Plans (Optional)
            </label>
            <input
              type="file"
              name="referenceFile"
              className={formStyles.fileInput}
            />
          </div>
        </RequestPageLayout>
      </form>
      <Footer />
    </>
  );
};

export default ThreeDWalkthroughPage;
