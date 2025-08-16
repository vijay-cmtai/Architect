import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicesPage";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/pages/ContactUs";
import Register from "@/pages/MultiRoleRegisterPage";
import Login from "@/pages/Login";
import BrowseProductsPage from "./pages/BrowseProductsPage";
import ThreeDPlansPage from "./pages/ThreeDPlansPage";
import InteriorDesignsPage from "./pages/InteriorDesignsPage";
import ConstructionProductsPage from "./pages/ConstructionProductsPage";
import CustomizeRequestPage from "./pages/CustomizeRequestPage";
import InteriorDesignRequestPage from "./pages/InteriorDesignRequestPage";
import ThreeDElevationPage from "./pages/ThreeDElevationPage";
import ScrollToTop from "@/components/ScrollToTop";
import CorporateInquiryPage from "./pages/CorporateInquiryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/category/:categoryName"
              element={<BrowseProductsPage />}
            />
            <Route path="/plans/:regionName" element={<BrowseProductsPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/floor-plans" element={<BrowseProductsPage />} />
            <Route path="3D-plans" element={<ThreeDPlansPage />} />
            <Route path="/interior-designs" element={<InteriorDesignsPage />} />
            <Route
              path="/construction-products"
              element={<ConstructionProductsPage />}
            />
            <Route
              path="/customize/floor-plans"
              element={<CustomizeRequestPage />}
            />
            <Route
              path="/customize/interior-designs"
              element={<InteriorDesignRequestPage />}
            />
            <Route
              path="/customize/3d-elevation"
              element={<ThreeDElevationPage />}
            />
            <Route
              path="/customize/interior-designs"
              element={<ConstructionProductsPage />}
            />
            <Route
              path="/corporate-inquiry/:packageType"
              element={<CorporateInquiryPage />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
