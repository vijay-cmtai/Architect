// Example file path: src/components/TopBar.jsx

import React from "react";
// FIX: Imported the Twitter icon and removed Phone/Mail as they are not used in the new design's icon style.
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

// This custom WhatsApp icon is still useful for the contact section.
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const TopBar = () => {
  // DATA NOT CHANGED, as requested.
  const contactInfo = {
    email: "houseplansdesignsfile@gmail.com",
    phone: "+919755248864",
  };

  // FIX: Updated social links to match the new icon set.
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com", // Replace with your actual link
      icon: <Facebook size={18} />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com", // Replace with your actual link
      icon: <Twitter size={18} />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com", // Replace with your actual link
      icon: <Instagram size={18} />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com", // Replace with your actual link
      icon: <Youtube size={18} />,
    },
  ];

  return (
    // FIX: Updated header style to match the new design (white background, borders).
    <header className="bg-white border-b border-gray-200 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-sky-400"></div>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left Side: Social Media Icons */}
        {/* FIX: Moved social icons to the left and updated their style. */}
        <div className="flex items-center gap-x-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              className="text-gray-600 transition-colors hover:text-sky-500"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Center: Title Text */}
        {/* FIX: Added the central text element. */}
        <div>
          <span className="font-semibold text-orange-500 text-sm tracking-wider">
            INNOVATIVE DESIGN SOLUTIONS
          </span>
        </div>

        {/* Right Side: Contact Information */}
        {/* FIX: Updated layout and style of contact info. */}
        <div className="flex items-center gap-x-6 text-sm text-gray-700">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-x-2 transition-colors hover:text-sky-500"
          >
            <span className="font-medium">Email Us:</span>
            <span>{contactInfo.email}</span>
          </a>
          <a
            href={`https://wa.me/${contactInfo.phone.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-2 transition-colors hover:text-green-600"
          >
            <div className="text-green-500">
              <WhatsAppIcon />
            </div>
            <span className="font-medium">{contactInfo.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
