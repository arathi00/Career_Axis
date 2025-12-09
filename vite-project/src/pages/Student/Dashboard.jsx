import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "../../styles/components.css";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("resume");

  return (
    <StudentLayout>
      <div className="trainer-dashboard-style">

        {/* HEADER */}
        <h1 className="trainer-title">Welcome back, Student!</h1>
        <p className="trainer-subtitle">Continue your journey to career success</p>

        {/* ==== TRAINER-STYLE STAT CARDS ==== */}
        <div className="trainer-stats">
          <div className="trainer-stat-card blue">
            <p className="stat-label">Modules Completed</p>
            <h2 className="stat-value">12</h2>
          </div>

          <div className="trainer-stat-card green">
            <p className="stat-label">Average Score</p>
            <h2 className="stat-value">8.4</h2>
          </div>

          <div className="trainer-stat-card purple">
            <p className="stat-label">Study Time</p>
            <h2 className="stat-value">24h</h2>
          </div>

          <div className="trainer-stat-card orange">
            <p className="stat-label">Certifications</p>
            <h2 className="stat-value">3</h2>
          </div>
        </div>

        {/* ==== SINGLE-ROW TABS (5 ITEMS) ==== */}
<div className="student-tabs-one-row">

  <button
    className={`tab-btn ${activeTab === "resume" ? "active" : ""}`}
    onClick={() => setActiveTab("resume")}
  >
    Resume Builder
  </button>

  <button
    className={`tab-btn ${activeTab === "assessments" ? "active" : ""}`}
    onClick={() => setActiveTab("assessments")}
  >
    Assessments
  </button>

  <button
    className={`tab-btn ${activeTab === "mock" ? "active" : ""}`}
    onClick={() => setActiveTab("mock")}
  >
    Mock Interview
  </button>

  <button
    className={`tab-btn ${activeTab === "chatbot" ? "active" : ""}`}
    onClick={() => setActiveTab("chatbot")}
  >
    Chatbot
  </button>

  <button
    className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
    onClick={() => setActiveTab("analytics")}
  >
    Analytics
  </button>

</div>

        {/* ==== TAB CONTENT AREA ==== */}
        <div className="tab-content-area">

          {activeTab === "resume" && (
            <div className="tab-card">
              <h3>Resume Builder</h3>
              <p>Create or update your professional resume.</p>
            </div>
          )}

          {activeTab === "assessments" && (
            <div className="tab-card">
              <h3>Assessments</h3>
              <p>Attempt quizzes and evaluate your skills.</p>
            </div>
          )}

          {activeTab === "mock" && (
            <div className="tab-card">
              <h3>Mock Interviews</h3>
              <p>Practice with AI-generated interview questions.</p>
            </div>
          )}

          {activeTab === "chatbot" && (
            <div className="tab-card">
              <h3>Chatbot Assistant</h3>
              <p>Get instant career help anytime.</p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="tab-card">
              <h3>Analytics</h3>
              <p>Visualize your performance and progress.</p>
            </div>
          )}

        </div>

        {/* ==== PROGRESS SECTION ==== */}
        <div className="trainer-progress-card">
          <h3>Your Overall Progress</h3>

          <h1 className="overall-percent">85%</h1>

          <div className="progress-track large">
            <div className="progress-bar-fill" style={{ width: "85%" }}></div>
          </div>

          <p className="progress-message">
            Great progress! Keep up the excellent work.
          </p>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
