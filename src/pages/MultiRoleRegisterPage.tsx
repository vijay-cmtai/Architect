import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react"; // CheckCircle icon ko import karein
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const userRoles = [
  {
    id: "professional",
    label: "Register as a Professional (Architect, Engineer, etc.)",
  },
  { id: "material-seller", label: "Register as a Material Seller" },
  { id: "city-partner", label: "Register as a City Construction Partner" },
];

const professionalSubRoles = [
  "Architect",
  "Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
];

const materialTypes = [
  "Cement & Concrete",
  "Bricks & Blocks",
  "Steel & Rebar",
  "Sanitary Ware",
  "Electricals & Wiring",
  "Paints & Finishes",
  "Flooring & Tiles",
  "Wood & Plywood",
];

const formStyles = {
  label: "block text-sm font-semibold text-foreground mb-2",
  input:
    "w-full px-4 py-3 bg-input border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition",
  textarea:
    "w-full px-4 py-3 bg-input border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition min-h-[100px]",
};

const MultiRoleRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("city-partner");

  const renderRoleSpecificFields = () => {
    const motionProps = {
      key: selectedRole,
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    };

    switch (selectedRole) {
      case "material-seller":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <label htmlFor="businessName" className={formStyles.label}>
                Business Name <span className="text-destructive">*</span>
              </label>
              <Input id="businessName" required className={formStyles.input} />
            </div>
            <div>
              <label htmlFor="phone" className={formStyles.label}>
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                id="phone"
                type="tel"
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="address" className={formStyles.label}>
                Address <span className="text-destructive">*</span>
              </label>
              <Textarea id="address" required className={formStyles.textarea} />
            </div>
            <div>
              <label htmlFor="city" className={formStyles.label}>
                City <span className="text-destructive">*</span>
              </label>
              <Input id="city" required className={formStyles.input} />
            </div>
            <div>
              <label htmlFor="materialType" className={formStyles.label}>
                Type of Material Selling{" "}
                <span className="text-destructive">*</span>
              </label>
              <Select>
                <SelectTrigger className={formStyles.input}>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((m) => (
                    <SelectItem
                      key={m}
                      value={m.toLowerCase().replace(/ /g, "-")}
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="photo" className={formStyles.label}>
                Your Photo / Shop Photo
              </label>
              <Input id="photo" type="file" className={formStyles.input} />
            </div>
          </motion.div>
        );
      case "city-partner":
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <label htmlFor="companyName" className={formStyles.label}>
                Company Name <span className="text-destructive">*</span>
              </label>
              <Input id="companyName" required className={formStyles.input} />
            </div>
            <div>
              <label htmlFor="partnerPhone" className={formStyles.label}>
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                id="partnerPhone"
                type="tel"
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="partnerAddress" className={formStyles.label}>
                Address <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="partnerAddress"
                required
                className={formStyles.textarea}
              />
            </div>
            <div>
              <label htmlFor="partnerCity" className={formStyles.label}>
                City of Operation <span className="text-destructive">*</span>
              </label>
              <Input id="partnerCity" required className={formStyles.input} />
            </div>
            <div>
              <label htmlFor="partnerPhoto" className={formStyles.label}>
                Your Photo / Company Logo
              </label>
              <Input
                id="partnerPhoto"
                type="file"
                className={formStyles.input}
              />
            </div>
          </motion.div>
        );
      case "professional":
      default:
        return (
          <motion.div {...motionProps} className="space-y-5">
            <div>
              <label htmlFor="fullName" className={formStyles.label}>
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input id="fullName" required className={formStyles.input} />
            </div>
            <div>
              <label htmlFor="profPhone" className={formStyles.label}>
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                id="profPhone"
                type="tel"
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="sub-role" className={formStyles.label}>
                Your Profession <span className="text-destructive">*</span>
              </label>
              <Select>
                <SelectTrigger className={formStyles.input}>
                  <SelectValue placeholder="Choose your profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionalSubRoles.map((subRole) => (
                    <SelectItem
                      key={subRole}
                      value={subRole.toLowerCase().replace(/ /g, "-")}
                    >
                      {subRole}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-soft-teal p-4 py-12">
        <div className="bg-card text-foreground p-8 sm:p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          <form className="space-y-5">
            {/* --- BADLAAV YAHAN KIYA GAYA HAI: Dropdown ko custom radio buttons se replace kiya gaya hai --- */}
            <fieldset className="space-y-3">
              <legend className="sr-only">Select your registration type</legend>
              {userRoles.map((role) => (
                <div key={role.id}>
                  <input
                    type="radio"
                    id={role.id}
                    name="user-role"
                    value={role.id}
                    className="sr-only" // Asli radio button ko hide karein
                    checked={selectedRole === role.id}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <label
                    htmlFor={role.id}
                    className={`flex items-center justify-between w-full p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      selectedRole === role.id
                        ? "bg-accent text-accent-foreground border-transparent shadow-md"
                        : "bg-input border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-semibold">{role.label}</span>
                    {selectedRole === role.id && <CheckCircle size={20} />}
                  </label>
                </div>
              ))}
            </fieldset>

            <AnimatePresence mode="wait">
              {renderRoleSpecificFields()}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className={formStyles.label}>
                Email address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                id="email"
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="password" className={formStyles.label}>
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  className={`${formStyles.input} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-4">
              By registering, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <Button
              type="submit"
              className="w-full text-base font-bold py-3 h-12 btn-primary"
            >
              Register
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MultiRoleRegisterPage;
