import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Chatbot from "../pages/Student/Chatbot.jsx";
import Dashboard from "../pages/Admin/AdminDashboard.jsx";



// Placeholder dashboards (you can replace later)
const StudentDashboard = () => <h2>Student Dashboard</h2>;
const TrainerDashboard = () => <h2>Trainer Dashboard</h2>;
const AdminDashboard = () => <h2>Admin Dashboard</h2>;

// ProtectedRoute component (simple version for now)
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const isAuthenticated = false; // Change to use context/hook later

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="student/chatbot" element={<h1>Chatbot Works!</h1>} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      
      {/* Protected routes example */}
      <Route
        path="/student"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
