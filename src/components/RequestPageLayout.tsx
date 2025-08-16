import React from "react";

interface RequestPageLayoutProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  children: React.ReactNode;
}

export const formStyles = {
  label: "block text-sm font-medium text-text-secondary mb-2",
  input:
    "w-full px-5 py-3 bg-[hsl(var(--background-muted))] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all",
  select:
    "w-full px-5 py-3 bg-[hsl(var(--background-muted))] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none",
  textarea:
    "w-full px-5 py-3 bg-[hsl(var(--background-muted))] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-y transition-all",
  fileInput:
    "w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer",
  radioLabel: "flex items-center gap-2 cursor-pointer text-text-secondary",
  radioInput: "h-4 w-4 border-border text-primary focus:ring-primary",
};

const RequestPageLayout: React.FC<RequestPageLayoutProps> = ({
  title,
  imageUrl,
  imageAlt,
  children,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 py-12 md:py-16 animate-fade-in">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
            {title}
          </h2>
          <form action="#" className="space-y-5">
            {children}
            <button
              type="submit"
              className="btn-primary w-full mt-6 text-lg py-3.5"
            >
              Send Request
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/2">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-[600px] object-cover rounded-2xl shadow-large"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestPageLayout;
