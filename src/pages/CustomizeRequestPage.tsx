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

const CustomizeRequestPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [formKey, setFormKey] = useState<number>(Date.now());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Floor Plan Customization");

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
          title="Customize Your Floor Plan"
          imageUrl="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          imageAlt="Beautiful house exterior"
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
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="width" className={formStyles.label}>
                Width (Ft)
              </label>
              <input
                type="number"
                id="width"
                name="width"
                className={formStyles.input}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="length" className={formStyles.label}>
                Length (Ft)
              </label>
              <input
                type="number"
                id="length"
                name="length"
                className={formStyles.input}
              />
            </div>
          </div>
          <div>
            <label htmlFor="facingDirection" className={formStyles.label}>
              Facing Direction
            </label>
            <select
              id="facingDirection"
              name="facingDirection"
              className={formStyles.select}
            >
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
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

export default CustomizeRequestPage;
