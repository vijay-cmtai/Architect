import React from "react";
import { useParams } from "react-router-dom";
import RequestPageLayout, { formStyles } from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Helper object to map URL slug back to the display title
const packageDetails = {
  "builders-colonizers": "Builders & Colonizers",
  "offices-shops": "Offices & Shops",
  "factories-educational": "Factories & Educational",
};

const CorporateInquiryPage: React.FC = () => {
  // Get the package type from the URL
  const { packageType } = useParams<{
    packageType: keyof typeof packageDetails;
  }>();
  const pageTitle = packageType
    ? packageDetails[packageType]
    : "Corporate Project";

  return (
    <>
      <Navbar />
      <div className="bg-soft-teal">
        <RequestPageLayout
          title={`Inquiry for ${pageTitle}`}
          imageUrl="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          imageAlt="Corporate team planning a project"
        >
          <div>
            <label htmlFor="companyName" className={formStyles.label}>
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className={formStyles.input}
            />
          </div>
          <div>
            <label htmlFor="contactPerson" className={formStyles.label}>
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              className={formStyles.input}
            />
          </div>
          <div>
            <label htmlFor="email" className={formStyles.label}>
              Work Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={formStyles.input}
            />
          </div>
          <div>
            <label htmlFor="phone" className={formStyles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={formStyles.input}
            />
          </div>
          <div>
            <label htmlFor="projectType" className={formStyles.label}>
              Project Type
            </label>
            <input
              type="text"
              id="projectType"
              name="projectType"
              className={`${formStyles.input} cursor-not-allowed bg-gray-200`}
              value={pageTitle}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="details" className={formStyles.label}>
              Project Details
            </label>
            <textarea
              id="details"
              name="details"
              placeholder="Briefly describe your project requirements..."
              className={formStyles.textarea}
            ></textarea>
          </div>
          <div>
            <label htmlFor="file-upload" className={formStyles.label}>
              Upload Project Brief (Optional)
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

export default CorporateInquiryPage;
