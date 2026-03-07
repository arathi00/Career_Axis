import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");

  if (!token || !stored) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(stored);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect mismatched roles to their own dashboard if possible
    if (user.role === "trainer") return <Navigate to="/trainer/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
