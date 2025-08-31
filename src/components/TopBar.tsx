// Example file path: src/components/TopBar.jsx

import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Send,
  AtSign,
  Mail,
  Phone,
} from "lucide-react";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />
  </svg>
);

const TopBar = () => {
  const contactInfo = {
    email: "houseplansdesignsfile@gmail.com",
    phone: "+919755248864",
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      color: "bg-blue-800",
      href: "https://facebook.com",
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      color: "bg-green-500",
      href: `https://wa.me/${contactInfo.phone.replace("+", "")}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      color: "bg-sky-500",
      href: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      color: "bg-sky-700",
      href: "https://linkedin.com",
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      color: "bg-red-600",
      href: "https://pinterest.com",
    },
    {
      name: "Telegram",
      icon: <Send size={18} />,
      color: "bg-sky-400",
      href: "https://telegram.org",
    },
    { name: "Koo", icon: <AtSign size={18} />, color: "bg-black", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-sky-400"></div>

      {/* FIX: Se ha cambiado 'flex' por 'block lg:flex' para que sea responsive. */}
      <div className="container mx-auto px-4 py-2 block lg:flex lg:justify-between lg:items-center">
        {/* Lado Izquierdo: Iconos de Redes Sociales */}
        <div className="flex items-center gap-x-2 justify-center lg:justify-start mb-2 lg:mb-0">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              className={`w-8 h-8 flex items-center justify-center rounded-md text-white transition-opacity hover:opacity-80 ${social.color}`}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Centro: Título */}
        {/* FIX: Se ha añadido 'text-center' para la vista móvil. */}
        <div className="text-center my-2 lg:my-0">
          <span className="font-semibold text-orange-500 text-sm tracking-wider">
            Future-Ready Home Design: Innovative Solutions You Need
          </span>
        </div>

        {/* Lado Derecho: Información de Contacto */}
        {/* FIX: Se ha cambiado 'flex' por 'flex-wrap' y 'justify-center' para la vista móvil. */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-6 gap-y-1 text-sm text-gray-700">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-x-2 transition-colors hover:text-sky-500"
          >
            <Mail size={16} />
            <span>{contactInfo.email}</span>
          </a>
          <a
            href={`tel:${contactInfo.phone}`}
            className="flex items-center gap-x-2 transition-colors hover:text-green-600"
          >
            <Phone size={16} />
            <span>{contactInfo.phone}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
