// Update App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute"; // Add this
import Home from "./pages/client/Home";
import Shop from "./pages/client/Shop";
import Cart from "./pages/client/Cart";
import SignUp from "./pages/client/SignUp";
import SignIn from "./pages/client/SignIn";
import ProductDetails from "./pages/client/ProductDetails";
import Contact from "./pages/client/Contact";
import ProtectedCheckout from "./components/ProtectedCheckout";
import { AuthProvider } from "./hooks/useAuth";
import Account from "./pages/client/Account";
import { CartProvider } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { SearchProvider } from "./hooks/useSearch";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PaymentSuccessNotification } from "./components/PaymentSuccessNotification";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import AdminPayments from "./pages/admin/Payments";

function AppContent() {
  const { isLoading, isAdmin, user } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <PaymentSuccessNotification /> {/* This will show globally */}
        <Routes>
          {/* Public Routes accessible to all */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="cart" element={<Cart />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product/:id/:name" element={<ProductDetails />} />

            {/* Sign in/Sign up - redirect admins to admin dashboard */}
            <Route
              path="signup"
              element={
                <ClientRoute>
                  <SignUp />
                </ClientRoute>
              }
            />
            <Route
              path="signin"
              element={
                <ClientRoute>
                  <SignIn />
                </ClientRoute>
              }
            />

            {/* Protected client routes - only for non-admin users */}
            <Route
              path="checkout/:id"
              element={
                <ClientRoute>
                  <ProtectedCheckout />
                </ClientRoute>
              }
            />
            <Route
              path="account"
              element={
                <ClientRoute>
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                </ClientRoute>
              }
            />
          </Route>

          {/* Admin Routes - only for admin users */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>

          {/* Catch-all route - redirect based on user role */}
          <Route
            path="*"
            element={
              user ? (
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <NotificationProvider>
      <SearchProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </SearchProvider>
    </NotificationProvider>
  );
}

export default App;
