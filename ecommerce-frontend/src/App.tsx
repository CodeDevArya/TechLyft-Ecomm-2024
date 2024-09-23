// App.tsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Header from "./components/Header/Header";
import Loader from "./components/admin/Loader";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const SelectedProductPage = lazy(() => import("./pages/SelectedProductPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Chechout = lazy(() => import("./pages/chechout"));
const SignUpPage = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailVerificationPage = lazy(
  () => import("./pages/EmailVerificationPage")
);
const Orders = lazy(() => import("./pages/Orders"));
const OrdersDetails = lazy(() => import("./pages/OrderDetails"));
const NotFound = lazy(() => import("./pages/404NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Admin pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

export const server = import.meta.env.VITE_SERVER;

const HeaderWrapper = () => {
  const location = useLocation();
  return !location.pathname.includes("/admin") &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/signup") &&
    !location.pathname.includes("/forgot-password") &&
    !location.pathname.includes("/verify-email") &&
    !location.pathname.includes("/reset-password") ? (
    <Header />
  ) : null;
};

// Admin Route
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading, isCheckingAuth } = useAuthStore();

  if (isLoading || isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading, isCheckingAuth } = useAuthStore();

  if (isLoading || isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

// Redirect Authenticated Users
const RedirectAuthenticatedUsers = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, user, isLoading, isCheckingAuth } = useAuthStore();

  if (isLoading || isCheckingAuth) {
    return <Loader />;
  }

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(
        "https://techlyft-ecomm-2024-server.onrender.com/api/v1/products/latest-products"
      );
    }, 14 * 60 * 1000); // Ping every 14 minutes

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <HeaderWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/shop" element={<Search />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route
            path="/shop/product/visit/:productid"
            element={<SelectedProductPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrdersDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Chechout />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Routes */}
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUsers>
                <SignUpPage />
              </RedirectAuthenticatedUsers>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUsers>
                <Login />
              </RedirectAuthenticatedUsers>
            }
          />

          {/* Other Auth Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route
              path="dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="product"
              element={
                <AdminRoute>
                  <Products />
                </AdminRoute>
              }
            />
            <Route
              path="customer"
              element={
                <AdminRoute>
                  <Customers />
                </AdminRoute>
              }
            />
            <Route
              path="transaction"
              element={
                <AdminRoute>
                  <Transaction />
                </AdminRoute>
              }
            />
            {/* Charts */}
            <Route
              path="chart/bar"
              element={
                <AdminRoute>
                  <Barcharts />
                </AdminRoute>
              }
            />
            <Route
              path="chart/pie"
              element={
                <AdminRoute>
                  <Piecharts />
                </AdminRoute>
              }
            />
            <Route
              path="chart/line"
              element={
                <AdminRoute>
                  <Linecharts />
                </AdminRoute>
              }
            />
            {/* Apps */}
            <Route
              path="app/coupon"
              element={
                <AdminRoute>
                  <Coupon />
                </AdminRoute>
              }
            />
            <Route
              path="app/stopwatch"
              element={
                <AdminRoute>
                  <Stopwatch />
                </AdminRoute>
              }
            />
            <Route
              path="app/toss"
              element={
                <AdminRoute>
                  <Toss />
                </AdminRoute>
              }
            />
            {/* Management */}
            <Route
              path="product/new"
              element={
                <AdminRoute>
                  <NewProduct />
                </AdminRoute>
              }
            />
            <Route
              path="product/:id"
              element={
                <AdminRoute>
                  <ProductManagement />
                </AdminRoute>
              }
            />
            <Route
              path="transaction/:id"
              element={
                <AdminRoute>
                  <TransactionManagement />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
