import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AH</span>
              </div>
              <span className="text-xl font-bold">ArchHome</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Creating exceptional architectural designs and house plans for over 15 years. 
              Your dream home starts with the perfect design.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                'Custom House Plans',
                'Structural Engineering',
                'Interior Design',
                'Building Permits',
                '3D Visualization',
                'Construction Support'
              ].map((service, index) => (
                <li key={index}>
                  <Link to="#" className="text-gray-300 hover:text-accent transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {[
                'Help Center',
                'Contact Us',
                'FAQs',
                'Terms of Service',
                'Privacy Policy',
                'Refund Policy'
              ].map((item, index) => (
                <li key={index}>
                  <Link to="#" className="text-gray-300 hover:text-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-300">
                  123 Architecture Street,<br />
                  Design City, DC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-300">info@archhome.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ArchHome. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;