import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ready Made House Plan", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "shadow-medium backdrop-blur-md bg-white/95"
          : "shadow-soft bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-orange">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <span className="text-xl font-bold text-primary-gray group-hover:text-primary transition-colors duration-300">
              ArchHome
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors duration-200 relative group ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-primary-gray hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-200 ${
                    isActive(link.path)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Desktop Icons & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-3 text-primary-gray hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-3 text-primary-gray hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110">
              <Heart className="w-5 h-5" />
            </button>
            <Link
              to="/cart"
              className="p-3 text-primary-gray hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold animate-pulse">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            {/* === AUTH BUTTONS FOR DESKTOP === */}
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              className="p-2 text-primary-gray hover:text-primary"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary-gray hover:text-primary"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg transform ${
                    isActive(link.path)
                      ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5 translate-x-2"
                      : "text-primary-gray hover:text-primary hover:bg-primary/5 hover:translate-x-2"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t mt-4">
                <button className="p-3 text-primary-gray hover:text-primary">
                  <Search className="w-6 h-6" />
                </button>
                <button className="p-3 text-primary-gray hover:text-primary">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              {/* === AUTH BUTTONS FOR MOBILE === */}
              <div className="flex flex-col space-y-3 pt-6 px-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
