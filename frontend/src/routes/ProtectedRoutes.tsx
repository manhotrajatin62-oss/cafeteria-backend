import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/auth";

const ProtectedRoutes = () => {
  const user = getAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;