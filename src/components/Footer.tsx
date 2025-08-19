import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Home, // Ek behtar icon logo ke liye
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--text-primary))] text-[hsl(var(--background-soft))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ArchHome</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Creating exceptional architectural designs for over 15 years. Your
              dream home starts with the perfect plan.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
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
                { name: "Brand Partners", href: "/brand-partners" }, 
                { name: "FAQs", href: "/faq" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
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
                  123 Architecture St, Design City, DC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@archhome.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@archhome.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 ArchHome. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
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
