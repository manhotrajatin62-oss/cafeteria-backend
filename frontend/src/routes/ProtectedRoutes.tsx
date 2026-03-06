import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/auth";

const ProtectedRoutes = () => {
  const user = getAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  // prevent admin from accessing user routes
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;