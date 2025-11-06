import { FC } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store"; // Path is already corrected

// Guards, Layouts, Pages...
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import UserLayout from "./components/users/UserLayout";
import BrokerLayout from "./components/broker/BrokerLayout";
import CompanyLayout from "./components/company/CompanyLayout";
import ServicesLayout from "./pages/ServicesLayout";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Commercial from "./pages/Commercial";
import NewProjects from "./pages/NewProjects";
import PropertyServices from "./pages/PropertyServices";
import Wishlist from "./pages/Wishlist";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Press from "./pages/Press";
import Careers from "./pages/Careers";
import InvestorRelations from "./pages/InvestorRelations";
import HomeLoans from "./pages/HomeLoans";
import PropertyManagement from "./pages/PropertyManagement";
import LegalServices from "./pages/LegalServices";
import InteriorDesign from "./pages/InteriorDesign";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HotDeals from "./pages/HotDeals";

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors position="top-right" />
        <Provider store={store}>
          <BrowserRouter>
            {/* Pop-up logic has been removed. The website will now load directly. */}
            <ScrollToTop />
            <Routes>
              {/* --- Yahan aapke saare routes rahenge --- */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/commercial" element={<Commercial />} />
                <Route path="/new-projects" element={<NewProjects />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="/property-services"
                  element={<PropertyServices />}
                />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/press" element={<Press />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/hot-deals" element={<HotDeals />} />
                <Route
                  path="/investor-relations"
                  element={<InvestorRelations />}
                />
                <Route path="/services" element={<ServicesLayout />}>
                  <Route index element={<HomeLoans />} />
                  <Route path="home-loans" element={<HomeLoans />} />
                  <Route
                    path="property-management"
                    element={<PropertyManagement />}
                  />
                  <Route
                    path="legal-services"
                    element={<LegalServices />}
                  />
                  <Route
                    path="interior-design"
                    element={<InteriorDesign />}
                  />
                </Route>
              </Route>

              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route element={<ProtectedRoute />}>
                <Route
                  element={<RoleBasedRoute allowedRoles={["Admin"]} />}
                >
                  <Route path="/admin/*" element={<AdminLayout />} />
                </Route>
                <Route
                  element={<RoleBasedRoute allowedRoles={["Company"]} />}
                >
                  <Route path="/company/*" element={<CompanyLayout />} />
                </Route>
                <Route
                  element={<RoleBasedRoute allowedRoles={["Associate"]} />}
                >
                  <Route path="/broker/*" element={<BrokerLayout />} />
                </Route>
                <Route
                  element={<RoleBasedRoute allowedRoles={["Customer"]} />}
                >
                  <Route path="/users/*" element={<UserLayout />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
