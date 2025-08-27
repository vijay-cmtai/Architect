import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { store } from "./lib/store";

// Import all your page components
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
import BrandPartnersSection from "./components/BrandPartnersSection";
import CareersPage from "./pages/CareersPage";
import ApplicationPage from "./pages/ApplicationPage";
import BookingPage from "./pages/BookingPage";
import PremiumBookingPage from "./pages/PremiumBookingPage";
import DownloadsPage1 from "./pages/DownloadsPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PaymentPolicy from "./pages/PaymentPolicy";
import RefundPolicy from "./pages/RefundPolicy";

// === DASHBOARD PAGES IMPORTS ===
import DashboardLayout from "./pages/Userdashboard/DashboardLayout";
import DashboardPage from "./pages/Userdashboard/DashboardPage";
import OrdersPage from "./pages/Userdashboard/OrdersPage";
import DownloadsPage from "./pages/Userdashboard/DownloadsPage";
import AddressesPage from "./pages/Userdashboard/AddressesPage";
import AccountDetailsPage from "./pages/Userdashboard/AccountDetailsPage";

// === ADMIN PAGES IMPORTS ===
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AllProductsPage from "./pages/admin/products/AllProductsPage";
import AddProductPage from "./pages/admin/products/AddProductPage";
import BrandsPage from "./pages/admin/products/BrandsPage";
import CategoriesPage from "./pages/admin/products/CategoriesPage";
import TagsPage from "./pages/admin/products/TagsPage";
import AttributesPage from "./pages/admin/products/AttributesPage";
import ReviewsPage from "./pages/admin/products/ReviewsPage";
import AllUsersPage from "./pages/admin/users/AllUsersPage";
import AddNewUserPage from "./pages/admin/users/AddNewUserPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import StatusPage from "./pages/admin/StatusPage";
import AdminCustomizationRequestsPage from "./pages/admin/AdminCustomizationRequestsPage";
import StandardRequestsPage from "./pages/admin/StandardRequestsPage";
import PremiumRequestsPage from "./pages/admin/PremiumRequestsPage";
import AllInquiriesPage from "./pages/admin/AllInquiriesPage";
import AllInquiriesSCPage from "./pages/admin/AllInquiriesSCPage";

// === PROFESSIONAL DASHBOARD PAGES IMPORTS ===
import ProfessionalLayout from "./pages/professional/ProfessionalLayout";
import ProfessionalDashboardPage from "./pages/professional/DashboardPage";
import MyProductsPage from "./pages/professional/MyProductsPage";
import AddProductPageProf from "./pages/professional/AddProductPage";
import ProfilePage from "./pages/professional/ProfilePage";
import ProfessionalOrdersPage from "./pages/professional/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  // ✨ FIX IS HERE: BrowserRouter is now wrapping all providers ✨
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/download" element={<DownloadsPage1 />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/apply" element={<ApplicationPage />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/payment-policy" element={<PaymentPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route
                  path="/category/:categoryName"
                  element={<BrowseProductsPage />}
                />
                <Route
                  path="/plans/:regionName"
                  element={<BrowseProductsPage />}
                />
                <Route path="/floor-plans" element={<BrowseProductsPage />} />
                <Route path="/3D-plans" element={<ThreeDPlansPage />} />
                <Route
                  path="/interior-designs"
                  element={<InteriorDesignsPage />}
                />
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
                  path="/corporate-inquiry/:packageType"
                  element={<CorporateInquiryPage />}
                />
                <Route
                  path="/brand-partners"
                  element={<BrandPartnersSection />}
                />
                <Route path="/booking-form" element={<BookingPage />} />
                <Route
                  path="/premium-booking-form"
                  element={<PremiumBookingPage />}
                />

                {/* User Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="downloads" element={<DownloadsPage />} />
                  <Route path="addresses" element={<AddressesPage />} />
                  <Route
                    path="account-details"
                    element={<AccountDetailsPage />}
                  />
                </Route>

                {/* Professional Dashboard Routes */}
                <Route path="/professional" element={<ProfessionalLayout />}>
                  <Route index element={<ProfessionalDashboardPage />} />
                  <Route path="my-products" element={<MyProductsPage />} />
                  <Route
                    path="my-orders"
                    element={<ProfessionalOrdersPage />}
                  />
                  <Route path="add-product" element={<AddProductPageProf />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AllProductsPage />} />
                  <Route path="products/add" element={<AddProductPage />} />
                  <Route path="products/brands" element={<BrandsPage />} />
                  <Route
                    path="products/categories"
                    element={<CategoriesPage />}
                  />
                  <Route path="products/tags" element={<TagsPage />} />
                  <Route
                    path="products/attributes"
                    element={<AttributesPage />}
                  />
                  <Route path="products/reviews" element={<ReviewsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="status" element={<StatusPage />} />
                  <Route path="users" element={<AllUsersPage />} />
                  <Route path="users/add" element={<AddNewUserPage />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                  <Route
                    path="standard-requests"
                    element={<StandardRequestsPage />}
                  />
                  <Route
                    path="premium-requests"
                    element={<PremiumRequestsPage />}
                  />
                  <Route
                    path="customization-requests"
                    element={<AdminCustomizationRequestsPage />}
                  />
                  <Route path="inquiries" element={<AllInquiriesPage />} />
                  <Route path="inquiries-sc" element={<AllInquiriesSCPage />} />
                </Route>

                {/* 404 Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);

export default App;
