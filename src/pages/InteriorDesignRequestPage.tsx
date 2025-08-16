import React from "react";
import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InteriorDesignRequestPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <RequestPageLayout
        title="Design Your Interior Space"
        imageUrl="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600"
        imageAlt="Example of modern interior design"
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="width-ft" className={formStyles.label}>
              Room Width (Ft)
            </label>
            <input
              type="number"
              id="width-ft"
              name="width-ft"
              className={formStyles.input}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="length-ft" className={formStyles.label}>
              Room Length (Ft)
            </label>
            <input
              type="number"
              id="length-ft"
              name="length-ft"
              className={formStyles.input}
            />
          </div>
        </div>
        <div>
          <label htmlFor="required-for" className={formStyles.label}>
            Design For
          </label>
          <select
            id="required-for"
            name="required-for"
            className={formStyles.select}
          >
            <option>Residential Interior Design</option>
            <option>Commercial Interior Design</option>
          </select>
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
      <Footer />
    </>
  );
};

export default InteriorDesignRequestPage;
