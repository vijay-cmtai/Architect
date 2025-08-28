// src/App.jsx

import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { store } from "./lib/store";

// Import all page components
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
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
import ScrollToTop from "@/components/ScrollToTop";
import CareersPage from "./pages/CareersPage";
import ApplicationPage from "./pages/ApplicationPage";
import DownloadsPage1 from "./pages/DownloadsPage";
import BlogsPage from "./pages/BlogsPage"; // Public blogs list
import SingleBlogPostPage from "./pages/SingleBlogPostPage"; // Single blog post

// === DASHBOARD PAGES IMPORTS ===
import DashboardLayout from "./pages/Userdashboard/DashboardLayout";
import DashboardPage from "./pages/Userdashboard/DashboardPage";
import OrdersPage from "./pages/Userdashboard/OrdersPage";
import DownloadsPage from "./pages/Userdashboard/DownloadsPage";
import AccountDetailsPage from "./pages/Userdashboard/AccountDetailsPage";

// === ADMIN PAGES IMPORTS ===
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AllProductsPage from "./pages/admin/products/AllProductsPage";
import AddProductPage from "./pages/admin/products/AddProductPage";
import AllUsersPage from "./pages/admin/users/AllUsersPage";
import AddNewUserPage from "./pages/admin/users/AddNewUserPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ReportsPage from "./pages/admin/ReportsPage";
// ✨ Blog Admin Pages Imports ✨
import AdminAddEditBlogPage from "./pages/admin/AdminAddEditBlogPage";

// === PROFESSIONAL DASHBOARD PAGES IMPORTS ===
import ProfessionalLayout from "./pages/professional/ProfessionalLayout";
import ProfessionalDashboardPage from "./pages/professional/DashboardPage";
import MyProductsPage from "./pages/professional/MyProductsPage";
import AddProductPageProf from "./pages/professional/AddProductPage";
import ProfilePage from "./pages/professional/ProfilePage";
import ProfessionalOrdersPage from "./pages/professional/OrdersPage";
import AdminBlogsPage from "./pages/admin/AdminBlogsPage";

const queryClient = new QueryClient();

const App = () => (
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
                {/* --- Public Routes --- */}
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/download" element={<DownloadsPage1 />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/apply" element={<ApplicationPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blog/:slug" element={<SingleBlogPostPage />} />
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

                {/* --- User Dashboard Routes --- */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="downloads" element={<DownloadsPage />} />
                  <Route
                    path="account-details"
                    element={<AccountDetailsPage />}
                  />
                </Route>

                {/* --- Professional Dashboard Routes --- */}
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

                {/* --- Admin Dashboard Routes --- */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AllProductsPage />} />
                  <Route path="products/add" element={<AddProductPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="users" element={<AllUsersPage />} />
                  <Route path="users/add" element={<AddNewUserPage />} />

                  {/* ✨ NEW BLOG ADMIN ROUTES ✨ */}
                  <Route path="blogs/add" element={<AdminAddEditBlogPage />} />
                  <Route path="blogs" element={<AdminBlogsPage />} />
                  <Route
                    path="blogs/edit/:slug"
                    element={<AdminAddEditBlogPage />}
                  />
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
