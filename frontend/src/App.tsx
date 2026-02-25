import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./auth/LoginPage";
import Home from "./pages/home/Home";
import Team from "./pages/about us/Team";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import NotFound from "./ui/NotFound";
import PendingOrders from "./pages/admin/orders/PendingOrders";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<Team/>} />
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/admin/orders" element={<PendingOrders/>} />
        <Route path="*" element={<NotFound/>} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
