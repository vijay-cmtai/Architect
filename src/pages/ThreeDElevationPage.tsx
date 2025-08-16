import React from "react";
import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const ElevationRequestPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal">
        <RequestPageLayout
          title="Get Your 3D Elevation"
          imageUrl="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          imageAlt="Example of a 3D house elevation"
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
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className={formStyles.label}>
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              className={formStyles.input}
            />
          </div>
          <div className="relative">
            <label htmlFor="plan-floor" className={formStyles.label}>
              Plan for Floor
            </label>
            <select
              id="plan-floor"
              name="plan-floor"
              className={formStyles.select}
            >
              <option>G</option>
              <option>G+1</option>
              <option>G+2</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-text-muted">
              <svg
                className="fill-current h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div>
            <label className={formStyles.label}>3D Elevation Type</label>
            <div className="flex items-center gap-6 pt-2">
              <label className={formStyles.radioLabel}>
                <input
                  type="radio"
                  name="elevation-type"
                  value="front"
                  defaultChecked
                  className={formStyles.radioInput}
                />
                Front
              </label>
              <label className={formStyles.radioLabel}>
                <input
                  type="radio"
                  name="elevation-type"
                  value="corner"
                  className={formStyles.radioInput}
                />
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
              placeholder="Message"
              className={formStyles.textarea}
            ></textarea>
          </div>
          <div>
            <label htmlFor="file-upload" className={formStyles.label}>
              Upload Reference (Image or PDF)
            </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload"
              className={formStyles.fileInput}
            />
          </div>
        </RequestPageLayout>
      </div>
      <Footer />
    </>
  );
};

export default ElevationRequestPage;
