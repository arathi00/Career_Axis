import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Landing from "../pages/Public/Landing";


/* STUDENT */
import StudentDashboard from "../pages/Student/Dashboard";
import InterviewList from "../pages/Student/Interview/InterviewList";
import InterviewFeedback from "../pages/Student/Interview/InterviewFeedback";
import Chatbot from "../pages/Student/Chatbot";
import QuizzList from "../pages/Student/Quiz/QuizzList";
import QuizzAttempt from "../pages/Student/Quiz/QuizzAttempt";
import QuizzReview from "../pages/Student/Quiz/QuizzReview";
import QuizzResult from "../pages/Student/Quiz/QuizzResult";
import QuizzScores from "../pages/Student/Quiz/QuizzScores";
import GeneratedAttempt from "../pages/Student/Quiz/GeneratedAttempt";
import Analytics from "../pages/Student/Analytics/AnalyticsProgress";
import TracksPage from "../pages/Student/TracksPage";
import CompanyDetails from "../pages/Student/Tracks/CompanyDetails";
import BranchDetails from "../pages/Student/Tracks/BranchDetails";

/* NEW: Assessment module */
import AssessmentHome from "../pages/Student/Assessment/AssessmentHome";
import CompanyAssessment from "../pages/Student/Assessment/CompanyAssessment";
import AssessmentQuiz from "../pages/Student/Assessment/QuizAttempt";
import AssessmentResult from "../pages/Student/Assessment/QuizResult";
/* TRAINER */
import TrainerDashboard from "../pages/Trainer/Dashboard";
import ManageInterviews from "../pages/Trainer/ManageInterviews";

/* ADMIN */
import AdminDashboard from "../pages/Admin/Dashboard";



/* LAYOUTS */
import StudentLayout from "../layouts/StudentLayout";
import TrainerLayout from "../layouts/TrainerLayout";

/* AUTH GUARD */
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ROOT */}
      <Route
        path="/"
        element={
          localStorage.getItem("token")
            ? <Navigate to="/student/dashboard" />
            : <Landing />
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
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/resume"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <h1>Resume Builder Coming Soon</h1>
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <QuizzList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/:id"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <QuizzAttempt />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/review"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <QuizzReview />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/result"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <QuizzResult />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/scores"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <QuizzScores />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/quiz/start"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <GeneratedAttempt />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <InterviewList />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview/feedback"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <InterviewFeedback />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/chatbot"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <Chatbot />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/analytics"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <Analytics />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/tracks"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <TracksPage />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Assessment module */}
      <Route path="/student/assessments" element={<ProtectedRoute><StudentLayout><AssessmentHome /></StudentLayout></ProtectedRoute>} />
      <Route path="/student/assessments/company/:name" element={<ProtectedRoute><StudentLayout><CompanyAssessment /></StudentLayout></ProtectedRoute>} />
      <Route path="/student/assessments/quiz" element={<ProtectedRoute><StudentLayout><AssessmentQuiz /></StudentLayout></ProtectedRoute>} />
      <Route path="/student/assessments/result" element={<ProtectedRoute><StudentLayout><AssessmentResult /></StudentLayout></ProtectedRoute>} />

      <Route
        path="/student/tracks/company/:name"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <CompanyDetails />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/tracks/aptitude/:dept"
        element={
          <ProtectedRoute>
            <StudentLayout>
              <BranchDetails />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= TRAINER ================= */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute>
            <TrainerLayout>
              <TrainerDashboard />
            </TrainerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/interviews"
        element={
          <ProtectedRoute>
            <TrainerLayout>
              <ManageInterviews />
            </TrainerLayout>
          </ProtectedRoute>
        }
      />
          

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;
