import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import Card from "../../components/UI/Card";

import { FaBook, FaClock, FaCertificate, FaStar } from "react-icons/fa";

const Dashboard = () => {
  return (
    <StudentLayout>
      <div className="student-dashboard">

        {/* Header */}
        <h1 className="dash-title">Welcome back, Student!</h1>
        <p className="dash-subtitle">Continue your journey to career success</p>

        {/* Stats Section */}
        <div className="stats-row">

          <Card className="stat-box">
            <FaBook className="stat-icon" />
            <h3 className="stat-value">12</h3>
            <p className="stat-label">Modules Completed</p>
          </Card>

          <Card className="stat-box">
            <FaStar className="stat-icon" />
            <h3 className="stat-value">8.4</h3>
            <p className="stat-label">Average Score</p>
          </Card>

          <Card className="stat-box">
            <FaClock className="stat-icon" />
            <h3 className="stat-value">24h</h3>
            <p className="stat-label">Study Time</p>
          </Card>

          <Card className="stat-box">
            <FaCertificate className="stat-icon" />
            <h3 className="stat-value">3</h3>
            <p className="stat-label">Certifications</p>
          </Card>

        </div>

        <h2 className="section-title">Quick Actions</h2>
<p className="section-subtitle">Access all your learning tools</p>

<div className="quick-actions">

  <div className="quick-card">
    <h3>Resume Builder</h3>
    <p>Create or update your resume</p>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: "75%" }}></div>
    </div>
  </div>

  <div className="quick-card">
    <h3>Assessments</h3>
    <p>Attempt quizzes and improve skills</p>
  </div>

  <div className="quick-card">
    <h3>Mock Interview</h3>
    <p>Practice with AI-generated interviews</p>
  </div>

  <div className="quick-card">
    <h3>Chatbot</h3>
    <p>Instant career guidance and help</p>
  </div>

  <div className="quick-card">
    <h3>Analytics</h3>
    <p>Track your performance visually</p>
  </div>

</div>


        {/* Learning Progress */}
        <div className="learning-progress">
          <h3>Your Overall Progress</h3>

          <h1 className="progress-percent">85%</h1>

          <div className="progress-bar big">
            <div className="progress-fill" style={{ width: "85%" }}></div>
          </div>

          <p className="progress-text">
            Great progress! Keep up the excellent work.
          </p>
        </div>

      </div>
    </StudentLayout>
  );
};

export default Dashboard;
