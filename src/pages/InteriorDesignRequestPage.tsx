"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";

import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InteriorDesignRequestPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [formKey, setFormKey] = useState<number>(Date.now());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Interior Design");

    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Request submitted successfully!");
      dispatch(resetStatus());
      setFormKey(Date.now());
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
          title="Design Your Interior Space"
          imageUrl="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600"
          imageAlt="Example of modern interior design"
          isLoading={actionStatus === "loading"}
        >
          {/* Your other form fields */}
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

          {/* FIX IS HERE: Added the missing 'country' input field */}
          <div>
            <label htmlFor="country" className={formStyles.label}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className={formStyles.input}
              defaultValue="India" // You can set a default or dynamic value
              required
            />
          </div>
          {/* End of fix */}

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="roomWidth" className={formStyles.label}>
                Room Width (Ft)
              </label>
              <input
                type="number"
                id="roomWidth"
                name="roomWidth"
                className={formStyles.input}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="roomLength" className={formStyles.label}>
                Room Length (Ft)
              </label>
              <input
                type="number"
                id="roomLength"
                name="roomLength"
                className={formStyles.input}
              />
            </div>
          </div>
          <div>
            <label htmlFor="designFor" className={formStyles.label}>
              Design For
            </label>
            <select
              id="designFor"
              name="designFor"
              className={formStyles.select}
            >
              <option value="Residential Interior Design">
                Residential Interior Design
              </option>
              <option value="Commercial Interior Design">
                Commercial Interior Design
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className={formStyles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Your message..."
              className={formStyles.textarea}
            ></textarea>
          </div>
          <div>
            <label className={formStyles.label}>
              Upload Reference (Image or PDF)
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

export default InteriorDesignRequestPage;
