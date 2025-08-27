import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Animation ke liye
import {
  LayoutGrid,
  Package,
  PlusSquare,
  User,
  LogOut,
  ClipboardList,
  X, // Close icon
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Dashboard", path: "/professional", icon: LayoutGrid },
  { name: "My Products", path: "my-products", icon: Package },
  { name: "Add New Product", path: "add-product", icon: PlusSquare },
  { name: "My Orders", path: "my-orders", icon: ClipboardList },
  { name: "My Profile", path: "profile", icon: User },
];

// BADLAV: Props (isOpen, setIsOpen) ko accept karein
const ProfessionalSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: { user: any }) => state.user);

  const handleLogout = () => {
    // Apni logout logic yahan daalein
    navigate("/login");
  };

  const baseClasses =
    "flex items-center w-full p-3.5 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "text-gray-200 hover:bg-slate-700";

  return (
    <>
      {/* NAYA CODE: Mobile par overlay, jo click par sidebar band kar dega */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* BADLAV: Responsive classes jodi gayi hain */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white p-4 flex flex-col z-40
                   w-64 transition-transform duration-300 ease-in-out
                   md:relative md:h-auto md:translate-x-0
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4 px-2">
          <Link to="/professional">
            <h1 className="text-2xl font-bold text-white">Professional</h1>
          </Link>
          {/* NAYA CODE: Mobile par dikhne wala Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-slate-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/professional"}
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
              // NAYA CODE: Link par click karne par sidebar band ho jayega
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="mr-3 h-5 w-5 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-700 pt-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ProfessionalSidebar;
