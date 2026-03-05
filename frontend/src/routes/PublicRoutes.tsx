import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../utils/auth";

const PublicRoutes = () => {
  const user = getAuth();

  if (user?.token) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoutes;
