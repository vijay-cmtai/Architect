import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle, // A good icon for WhatsApp
} from "lucide-react";

// SVG for Pinterest Icon
const PinterestIcon = () => (
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
    <path d="M12.52.27a.5.5 0 0 0-.52.27L7.5 7.43a2.43 2.43 0 0 0 .1 2.37L9.56 14a.5.5 0 0 1-.16.53l-2.48 1.55a.5.5 0 0 0-.2.68l2.96 5.51a.5.5 0 0 0 .68.2l4.42-2.33a.5.5 0 0 0 .28-.53l-1-4.2a.5.5 0 0 1 .4-.56l3.87-1.2a.5.5 0 0 0 .34-.65L16.7 3.55a.5.5 0 0 0-.6-.35l-3.33 1.33a.5.5 0 0 1-.58-.33L12.52.27Z" />
    <path d="M11 11.5c-.88.44-2.25 1.13-3 1.5" />
    <path d="m13 13.5 2-1" />
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/Houseplansndesignfiles" },
    { Icon: Instagram, href: "https://www.instagram.com/house_plan_files" },
    { Icon: Youtube, href: "https://www.youtube.com/@houseplanfiles" },
    {
      Icon: PinterestIcon,
      href: "https://www.youtube.com/channel/UCaZYmjNx6pJyokRHy2dk1QQ",
    },
    {
      Icon: MessageCircle,
      href: "https://www.whatsapp.com/channel/0029Va99lQoGZNCjNmi8U73x",
    },
  ];

  return (
    <footer className="bg-[hsl(var(--text-primary))] text-[hsl(var(--background-soft))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.png"
                alt="Houseplanfile Logo"
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white">
                HousePlanFiles
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Creating exceptional architectural designs for over 15 years. Your
              dream home starts with the perfect plan.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              {[
                { name: "Custom House Plans", href: "/products" },
                { name: "3D Visualization", href: "/services" },
                { name: "Interior Design", href: "/interior-designs" },
                { name: "Building Permits", href: "/services" },
                { name: "Construction Support", href: "/contact" },
                { name: "About", href: "/about" },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Payment Policy", href: "/payment-policy" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Blogs", href: "/blogs" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  Bareli, Madhya Pradesh, 464668, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+919755248864"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 97 552 488 64
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:houseplansdesignsfile@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  houseplansdesignsfile@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-6">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} HousePlanFiles. All rights reserved.
            </p>

            {/* ========================================================== */}
            {/* ✨ YAHAN PAR PAYMENT LOGOS KO IMG TAG SE LAGAYA GAYA HAI ✨ */}
            {/* ========================================================== */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white">
                We Accept:
              </span>
              <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-lg">
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png"
                  alt="Razorpay"
                  className="h-5"
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3no113HIfYGlfiWW58lJVwmAXif0Plr9Jkg&s"
                  alt="PayPal"
                  className="h-5"
                />
                <img
                  src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png"
                  alt="PhonePe"
                  className="h-6"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy-policy"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
