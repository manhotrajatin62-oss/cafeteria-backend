import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./auth/LoginPage";
import Home from "./pages/home/Home";
import Team from "./pages/about us/Team";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import NotFound from "./ui/NotFound";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import ProductTable from "./pages/admin/products/ProductTable";
import CustomerTable from "./pages/admin/customers/CustomerTable";
import AccountPage from "./pages/account/AccountPage";
import MenuPage from "./pages/admin/menu/MenuPage";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PublicRoutes from "./routes/PublicRoutes";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        {/* USER ROUTES */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Team />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoutes />}>
          <Route path="admin">
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductTable />} />
            <Route path="customers" element={<CustomerTable />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="menu" element={<MenuPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
