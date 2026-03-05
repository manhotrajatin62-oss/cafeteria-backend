import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/auth";

const AdminRoutes = () => {
  const user = getAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;