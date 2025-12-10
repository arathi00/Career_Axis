import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* STUDENT */
import StudentDashboard from "../pages/Student/StudentDashboard";
import Chatbot from "../pages/Student/Chatbot";
import QuizzList from "../pages/Student/QuizzList";
import QuizzAttempt from "../pages/Student/QuizzAttempt";
import QuizzReview from "../pages/Student/QuizzReview";
import QuizzResult from "../pages/Student/QuizzResult";

/* TRAINER */
import TrainerDashboard from "../pages/Trainer/TrainerDashboard";

/* ADMIN */
import AdminDashboard from "../pages/Admin/AdminDashboard";

/* PROTECTED ROUTE */
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const isAuthenticated = true; // temporary login

  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/student/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* ---------------------------
          STUDENT ROUTES
      ----------------------------- */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/chatbot"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      {/* QUIZ ROUTES */}
      <Route
        path="/student/quiz"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <QuizzList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <QuizzAttempt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/review"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <QuizzReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/result"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <QuizzResult />
          </ProtectedRoute>
        }
      />

      {/* ---------------------------
          TRAINER ROUTES
      ----------------------------- */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ---------------------------
          ADMIN ROUTES
      ----------------------------- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;
