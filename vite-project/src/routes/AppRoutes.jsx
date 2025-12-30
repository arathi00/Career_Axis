import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH PAGES */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* STUDENT PAGES */
import StudentDashboard from "../pages/Student/Dashboard";
import InterviewList from "../pages/Student/Interview/InterviewList";
import InterviewFeedback from "../pages/Student/Interview/InterviewFeedback";
import Chatbot from "../pages/Student/Chatbot";
import QuizzList from "../pages/Student/Quiz/QuizzList";
import QuizzAttempt from "../pages/Student/Quiz/QuizzAttempt";
import QuizzReview from "../pages/Student/Quiz/QuizzReview";
import QuizzResult from "../pages/Student/Quiz/QuizzResult";
import Analytics from "../pages/Student/Analytics/AnalyticsProgress";

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

      {/* ===========================
          STUDENT PROTECTED ROUTES
      ============================ */}
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

      {/* Resume */}
      <Route
        path="/student/resume"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <h1>Resume Builder Coming Soon</h1>
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Assessments + Quiz System */}
      <Route
        path="/student/quiz"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <QuizzList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <QuizzAttempt />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/review"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <QuizzReview />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/result"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <QuizzResult />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Mock Interview */}
      <Route
        path="/student/interview"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <InterviewList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview/feedback"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <InterviewFeedback />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Chatbot */}
      <Route
        path="/student/chatbot"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
              <Chatbot />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/student/analytics"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentLayout>
  <Analytics />
</StudentLayout>

          </ProtectedRoute>
        }
      />

      {/* ===========================
          TRAINER PROTECTED ROUTES
      ============================ */}
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

      {/* ===========================
          ADMIN PROTECTED ROUTES
      ============================ */}
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
