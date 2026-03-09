import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

/* AUTH */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

/* STUDENT */
import StudentDashboard from "../pages/Student/Dashboard";
import InterviewList from "../pages/Student/Interview/InterviewList";
import InterviewFeedback from "../pages/Student/Interview/InterviewFeedback";
import Chatbot from "../pages/Student/Chatbot";
import QuizzList from "../pages/Student/Quiz/QuizzList";
import QuizzAttempt from "../pages/Student/Quiz/QuizzAttempt";
import QuizzReview from "../pages/Student/Quiz/QuizzReview";
import QuizzResult from "../pages/Student/Quiz/QuizzResult";
import Analytics from "../pages/Student/Analytics/AnalyticsProgress";

/* TRAINER */
import TrainerDashboard from "../pages/Trainer/Dashboard";
import ManageInterviews from "../pages/Trainer/ManageInterviews";

/* ADMIN */
import AdminDashboard from "../pages/Admin/Dashboard";
import ManageStudents from "../pages/Admin/ManageStudents";
import ManageTrainers from "../pages/Admin/ManageTrainers";
import ManageAssessment from "../pages/Admin/ManageAssessments";
import CreateQuiz from "../pages/Admin/CreateQuiz";
/* LAYOUTS */
import StudentLayout from "../layouts/StudentLayout";
import TrainerLayout from "../layouts/TrainerLayout";
import ManageAssessments from "../pages/Admin/ManageAssessments";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ROOT */}
      <Route
        path="/"
        element={
          localStorage.getItem("token")
            ? <Navigate to="/student/dashboard" />
            : <Navigate to="/login" />
        }
      />

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= STUDENT ================= */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/resume"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <h1>Resume Builder Coming Soon</h1>
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <QuizzList />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <QuizzAttempt />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/review"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <QuizzReview />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/result"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <QuizzResult />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <InterviewList />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview/feedback"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <InterviewFeedback />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/chatbot"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <Chatbot />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/analytics"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <StudentLayout>
                <Analytics />
              </StudentLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= TRAINER ================= */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="trainer">
              <TrainerLayout>
                <TrainerDashboard />
              </TrainerLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/interviews"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="trainer">
              <TrainerLayout>
                <ManageInterviews />
              </TrainerLayout>
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-students"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="admin">
              <ManageStudents />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/manage-trainers"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRole="admin">
        <ManageTrainers />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/manage-assessments"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRole="admin">
        <ManageAssessments />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/create-quiz"
  element={
    <ProtectedRoute>
      <RoleBasedRoute role="admin">
        <CreateQuiz />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>
      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;
