import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH PAGES */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* STUDENT PAGES */
import StudentDashboard from "../pages/Student/Dashboard";

/* TRAINER PAGES */
import TrainerDashboard from "../pages/Trainer/Dashboard";

/* ADMIN PAGES */
import AdminDashboard from "../pages/Admin/Dashboard";

/* PROTECTED ROUTE */
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  // TEMPORARY for testing dashboard
  // Change this back to "false" after real authentication is added
  const isAuthenticated = true;

  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/student/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* STUDENT PROTECTED ROUTES */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* TRAINER PROTECTED ROUTES */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN PATHS */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;
