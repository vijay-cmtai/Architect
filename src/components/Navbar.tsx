// src/components/Navbar.jsx

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import WishlistPanel from "@/components/WishlistPanel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { state: cartState } = useCart();
  const { wishlistItems } = useWishlist();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const showCartAndWishlist = !userInfo || userInfo?.role === "user";

  const getDashboardPath = () => {
    if (!userInfo) return "/login";
    switch (userInfo.role) {
      case "professional":
        return "/professional";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Ready Made House Plan", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Career", path: "/careers" },
    { name: "Download", path: "/download" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md backdrop-blur-lg" : "bg-white"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-orange-200 rounded-full blur opacity-20"></div>
                <img
                  src="/logo.png"
                  alt="ArchHome Logo"
                  className="h-14 w-auto relative"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium relative transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-orange-600"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                  style={
                    link.name === "About" && isActive(link.path)
                      ? {
                          backgroundColor: "#F97316", // Orange color
                          color: "white",
                          padding: "2rem 1rem", // Tall padding
                          clipPath:
                            "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)", // Shape
                        }
                      : link.name === "About"
                        ? {
                            backgroundColor: "#F97316",
                            color: "white",
                            padding: "2rem 1rem",
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                          }
                        : {}
                  }
                >
                  {link.name}
                  {!isActive(link.path) && link.name !== "About" && (
                    <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons & User Info */}
            <div className="hidden lg:flex items-center space-x-5">
              <button className="text-gray-600 hover:text-orange-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {showCartAndWishlist && (
                <>
                  <button
                    onClick={() => setIsWishlistOpen(true)}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <Link
                    to="/cart"
                    className="relative text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartState.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartState.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2">
                      <Avatar className="w-9 h-9 border-2 border-orange-500">
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {userInfo.name
                            ? userInfo.name.charAt(0).toUpperCase()
                            : "V"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-700">
                        {userInfo.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to={getDashboardPath()}>
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 rounded-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-50 bg-white p-6 lg:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  ArchHome
                </Link>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-lg font-medium p-3 rounded-lg ${isActive(link.path) ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Navbar;
