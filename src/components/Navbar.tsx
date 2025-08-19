import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import WishlistPanel from "@/components/WishlistPanel";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { state } = useCart();
  const { wishlistItems } = useWishlist();
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
    { name: "Career", path: "/careers" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "shadow-medium backdrop-blur-md bg-background/95"
            : "shadow-soft bg-background"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-orange">
                <span className="text-white font-bold text-lg">AH</span>
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
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
                      : "text-foreground hover:text-primary"
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
              <button className="p-3 text-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110">
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-3 text-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110 relative"
                aria-label="Open Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold animate-pulse">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="p-3 text-foreground hover:text-primary transition-all duration-300 rounded-full hover:bg-primary/5 transform hover:scale-110 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold animate-pulse">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
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
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 text-foreground hover:text-primary relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <Link
                to="/cart"
                className="p-2 text-foreground hover:text-primary"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-foreground hover:text-primary"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Render the Wishlist Panel and pass state management props */}
      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
