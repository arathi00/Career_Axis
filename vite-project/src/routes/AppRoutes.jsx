import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH PAGES */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* STUDENT PAGES */
import StudentDashboard from "../pages/Student/Dashboard";
import InterviewList from "../pages/Student/Interview/InterviewList";
import InterviewFeedback from "../pages/Student/Interview/InterviewFeedback";

/* TRAINER PAGES */
import TrainerDashboard from "../pages/Trainer/Dashboard";
import ManageInterviews from "../pages/Trainer/ManageInterviews";

/* ADMIN PAGES */
import AdminDashboard from "../pages/Admin/Dashboard";

/* LAYOUTS */
import StudentLayout from "../layouts/StudentLayout";
import TrainerLayout from "../layouts/TrainerLayout";

/* PROTECTED ROUTE */
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const isAuthenticated = true; // TEMP

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
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* STUDENT INTERVIEW ROUTES */}
      <Route
        path="/student/interviews"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <InterviewList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interviews/history"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <InterviewFeedback />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* TRAINER PROTECTED ROUTES */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TrainerLayout>
              <TrainerDashboard />
            </TrainerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/interviews"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TrainerLayout>
              <ManageInterviews />
            </TrainerLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
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
