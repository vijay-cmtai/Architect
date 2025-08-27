import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
import { toast } from "sonner";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const ThreeDElevationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [formKey, setFormKey] = useState<number>(Date.now());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Elevation");

    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
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
          title="Get Your 3D Elevation"
          imageUrl="https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          imageAlt="Example of a 3D house elevation"
          isLoading={actionStatus === "loading"}
        >
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
            <label htmlFor="planForFloor" className={formStyles.label}>
              Plan for Floor
            </label>
            <select
              id="planForFloor"
              name="planForFloor"
              className={formStyles.select}
            >
              <option>G</option>
              <option>G+1</option>
              <option>G+2</option>
            </select>
          </div>
          <div>
            <label className={formStyles.label}>3D Elevation Type</label>
            <div className="flex gap-6 pt-2">
              <label className={formStyles.radioLabel}>
                <input
                  type="radio"
                  name="elevationType"
                  value="Front"
                  defaultChecked
                  className={formStyles.radioInput}
                />{" "}
                Front
              </label>
              <label className={formStyles.radioLabel}>
                <input
                  type="radio"
                  name="elevationType"
                  value="Corner"
                  className={formStyles.radioInput}
                />{" "}
                Corner
              </label>
            </div>
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

export default ThreeDElevationPage;