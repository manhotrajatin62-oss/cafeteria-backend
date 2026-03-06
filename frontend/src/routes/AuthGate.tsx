import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getAuth } from "../utils/auth";
import LoginPage from "../auth/LoginPage";
import AppLayout from "../layout/AppLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import Home from "../pages/home/Home";
import Team from "../pages/about us/Team";
const AccountPage = lazy(() => import("../pages/account/AccountPage"));
import AdminRoutes from "./AdminRoutes";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import OrdersPage from "../pages/admin/orders/OrdersPage";
import ProductTable from "../pages/admin/products/ProductTable";
import CustomerTable from "../pages/admin/customers/CustomerTable";
import MenuPage from "../pages/admin/menu/MenuPage";
import NotFound from "../ui/NotFound";
import Loader from "../ui/Loader";
import ErrorBoundary from "../ui/ErrorBoundary";

const AuthGate = () => {
  const user = getAuth();
  const location = useLocation();

  // If NOT logged in, only allow login routes
  if (!user?.token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If logged in but tries to visit login page
  if (location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <AppRoutes />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* USER ROUTES */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Team />} />
          <Route
            path="account"
            element={
              <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <AccountPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoutes />}>
          <Route path="admin">
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductTable />} />
            <Route path="customers" element={<CustomerTable />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AuthGate;
