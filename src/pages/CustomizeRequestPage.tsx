import React from "react";
import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const CustomizeRequestPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-soft-teal">
        <RequestPageLayout
          title="Customize Your Floor Plan"
          imageUrl="https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          imageAlt="Beautiful modern living room"
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
                Width (Ft)
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
                Length (Ft)
              </label>
              <input
                type="number"
                id="length-ft"
                name="length-ft"
                className={formStyles.input}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="facing" className={formStyles.label}>
              Facing Direction
            </label>
            <select id="facing" name="facing" className={formStyles.select}>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
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

export default CustomizeRequestPage;
