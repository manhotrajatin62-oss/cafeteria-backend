import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./auth/LoginPage";
import Home from "./pages/home/Home";
import Team from "./pages/about us/Team";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import NotFound from "./ui/NotFound";
import PendingOrders from "./pages/admin/orders/PendingOrders";
import ProductTable from "./pages/admin/products/ProductTable";
import CustomerTable from "./pages/admin/customers/CustomerTable";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<Team/>} />
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/admin/orders" element={<PendingOrders/>} />
        <Route path="/admin/products" element={<ProductTable/>} />
        <Route path="/admin/customers" element={<CustomerTable/>} />
        <Route path="*" element={<NotFound/>} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
