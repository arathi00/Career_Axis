import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components.css";
import dashboardApi from "../../api/dashboardApi";

import {
  FaFileAlt,
  FaClipboardList,
  FaVideo,
  FaRobot,
  FaChartPie,
} from "react-icons/fa";



const StudentDashboard = () => {

  // 🔹 ADDED: get logged-in user from localStorage
  const [studentName, setStudentName] = useState("Student");
  const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getStudentDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load student dashboard", error);
    }
  };

  fetchDashboard();
}, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setStudentName(user.name);
    }
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" :
    hour < 18 ? "Good Afternoon" :
    "Good Evening";

  return (
    <div className="trainer-dashboard-style">

      {/* HEADER */}
      <h1 className="trainer-title">
        {greeting}, {studentName} 👋
      </h1>

      <p className="trainer-subtitle">
        Track your learning progress and access training tools
      </p>

      {/* STATS */}
      <div className="trainer-stats">
        <div className="trainer-stat-card blue">
          <h2 className="stat-value">
            {dashboardData?.summary?.modulesCompleted ?? "--"}
          </h2>

        </div>

        <div className="trainer-stat-card green">
          <h2 className="stat-value">
  {dashboardData?.summary?.avgScore ?? "--"}
</h2>
        </div>

        <div className="trainer-stat-card purple">
          <h2 className="stat-value">
  {dashboardData?.summary?.studyHours ?? "--"}
</h2>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="trainer-progress-card">
        <h3>Learning Overview</h3>
        <p className="muted">
          Continue improving your skills through structured learning,
          assessments, and AI-powered interviews.
        </p>
      </div>

      {/* ACTION CARDS */}
      <div className="student-action-grid">

        <Link to="/student/resume" className="student-action-card">
          <FaFileAlt className="action-icon purple" />
          <h4>Resume Builder</h4>
          <p>Create or update your professional resume</p>
        </Link>

        <Link to="/student/quiz" className="student-action-card">
          <FaClipboardList className="action-icon blue" />
          <h4>Assessments</h4>
          <p>Attempt quizzes and evaluate skills</p>
        </Link>

        <Link to="/student/interview" className="student-action-card">
          <FaVideo className="action-icon green" />
          <h4>Mock Interview</h4>
          <p>Practice AI-powered interviews</p>
        </Link>

        <Link to="/student/chatbot" className="student-action-card">
          <FaRobot className="action-icon orange" />
          <h4>Chatbot</h4>
          <p>Instant career guidance</p>
        </Link>

        <Link to="/student/analytics" className="student-action-card">
          <FaChartPie className="action-icon purple" />
          <h4>Analytics</h4>
          <p>Track your performance visually</p>
        </Link>

      </div>
    </div>
  );
};

export default StudentDashboard;
