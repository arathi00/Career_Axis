import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem("role");

  if (role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleBasedRoute;
