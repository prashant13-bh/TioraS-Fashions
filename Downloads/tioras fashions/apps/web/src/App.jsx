import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext.jsx";
import { CartProvider } from "@/hooks/useCart.jsx";
import { WishlistProvider } from "@/contexts/WishlistContext.jsx";
import ScrollToTop from "@/components/ScrollToTop.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AdminProtectedRoute from "@/components/AdminProtectedRoute.jsx";
import FloatingWhatsApp from "@/components/FloatingWhatsApp.jsx";
import ChatWidget from "@/components/ChatWidget.jsx";

import HomePage from "@/pages/HomePage.jsx";
import ProductsPage from "@/pages/ProductsPage.jsx";
import ProductCategoryPage from "@/pages/ProductCategoryPage.jsx";
import ProductDetailPage from "@/pages/ProductDetailPage.jsx";
import SearchResultsPage from "@/pages/SearchResultsPage.jsx";
import SuccessPage from "@/pages/SuccessPage.jsx";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage.jsx";
import Cart from "@/pages/Cart.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import SignupPage from "@/pages/SignupPage.jsx";
import AIDesignerPage from "@/pages/AIDesignerPage.jsx";
import DesignStudioPage from "@/pages/DesignStudioPage.jsx";
import WriteReviewPage from "@/pages/WriteReviewPage.jsx";
import OrderTrackingPage from "@/pages/OrderTrackingPage.jsx";
import AdminOrderDetails from "@/pages/AdminOrderDetails.jsx";
import AdminOrdersDashboard from "@/pages/AdminOrdersDashboard.jsx";
import MobileBottomNav from "@/components/MobileBottomNav.jsx";

// Information Pages
import AboutPage from "@/pages/AboutPage.jsx";
import ContactPage from "@/pages/ContactPage.jsx";
import FAQPage from "@/pages/FAQPage.jsx";
import BlogListingPage from "@/pages/BlogListingPage.jsx";
import BlogPostDetailPage from "@/pages/BlogPostDetailPage.jsx";

// Customer Account
import AccountDashboard from "@/pages/AccountDashboard.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";
import EditProfilePage from "@/pages/EditProfilePage.jsx";
import SavedAddresses from "@/pages/SavedAddresses.jsx";
import AddressFormPage from "@/pages/AddressFormPage.jsx";
import WishlistPage from "@/pages/WishlistPage.jsx";
import AccountSettings from "@/pages/AccountSettings.jsx";
import CustomerOrderHistory from "@/pages/CustomerOrderHistory.jsx";
import OrderDetailsPage from "@/pages/OrderDetailsPage.jsx";

// Legal & Info Pages
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage.jsx";
import TermsConditionsPage from "@/pages/legal/TermsConditionsPage.jsx";
import ReturnPolicyPage from "@/pages/legal/ReturnPolicyPage.jsx";
import RefundPolicyPage from "@/pages/legal/RefundPolicyPage.jsx";
import ShippingPolicyPage from "@/pages/legal/ShippingPolicyPage.jsx";
import CancellationPolicyPage from "@/pages/legal/CancellationPolicyPage.jsx";
import LegalHubPage from "@/pages/legal/LegalHubPage.jsx";
import SitemapPage from "@/pages/SitemapPage.jsx";

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage.jsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.jsx";
import ProductsManagement from "@/pages/admin/ProductsManagement.jsx";
import OrdersManagement from "@/pages/admin/OrdersManagement.jsx";
import CustomersManagement from "@/pages/admin/CustomersManagement.jsx";
import SettingsPage from "@/pages/admin/SettingsPage.jsx";
import AdminReviewsPage from "@/pages/admin/AdminReviewsPage.jsx";
import AdminReviewAnalyticsPage from "@/pages/admin/AdminReviewAnalyticsPage.jsx";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <AdminAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <FloatingWhatsApp />
                <ChatWidget />
                <Routes>
                  {/* Public Core Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route
                    path="/products/category/:categoryName"
                    element={<ProductCategoryPage />}
                  />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmationPage />}
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Information Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/blog" element={<BlogListingPage />} />
                  <Route path="/blog/:slug" element={<BlogPostDetailPage />} />

                  {/* Design Studio Routes */}
                  <Route path="/ai-designer" element={<AIDesignerPage />} />
                  <Route path="/design-studio" element={<DesignStudioPage />} />
                  <Route path="/customize" element={<DesignStudioPage />} />

                  {/* Protected Features */}
                  <Route
                    path="/products/:productId/write-review"
                    element={
                      <ProtectedRoute>
                        <WriteReviewPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer Account Routes */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/profile/edit"
                    element={
                      <ProtectedRoute>
                        <EditProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses"
                    element={
                      <ProtectedRoute>
                        <SavedAddresses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses/new"
                    element={
                      <ProtectedRoute>
                        <AddressFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses/:addressId/edit"
                    element={
                      <ProtectedRoute>
                        <AddressFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/settings"
                    element={
                      <ProtectedRoute>
                        <AccountSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders"
                    element={
                      <ProtectedRoute>
                        <CustomerOrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-tracking/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderTrackingPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminProtectedRoute>
                        <ProductsManagement />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminProtectedRoute>
                        <OrdersManagement />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminProtectedRoute>
                        <CustomersManagement />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminProtectedRoute>
                        <SettingsPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reviews"
                    element={
                      <AdminProtectedRoute>
                        <AdminReviewsPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics/reviews"
                    element={
                      <AdminProtectedRoute>
                        <AdminReviewAnalyticsPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/:orderId"
                    element={
                      <AdminProtectedRoute>
                        <AdminOrderDetails />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminOrdersDashboard />
                      </AdminProtectedRoute>
                    }
                  />

                  {/* Legal Routes */}
                  <Route path="/legal" element={<LegalHubPage />} />
                  <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route
                    path="/terms-conditions"
                    element={<TermsConditionsPage />}
                  />
                  <Route path="/return-policy" element={<ReturnPolicyPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route
                    path="/shipping-policy"
                    element={<ShippingPolicyPage />}
                  />
                  <Route
                    path="/cancellation-policy"
                    element={<CancellationPolicyPage />}
                  />
                  <Route path="/sitemap" element={<SitemapPage />} />

                  {/* 404 Catch-All */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center">
                          <h1
                            className="text-5xl font-bold mb-4 text-foreground"
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            404
                          </h1>
                          <p className="text-xl text-muted-foreground mb-8">
                            The page you're looking for doesn't exist.
                          </p>
                          <a
                            href="/"
                            className="text-[#D4AF37] font-bold hover:underline"
                          >
                            Back to Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
                <MobileBottomNav />
                <Toaster />
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
