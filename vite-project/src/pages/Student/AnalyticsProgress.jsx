import React from "react";
import StudentLayout from "../../layout/StudentLayout.jsx"; 
import "./analytics.css";

const AnalyticsProgress = () => {
  const overallProgress = 0;
  const interviewMarks = 0; // 

  return (
    <StudentLayout>

      <div className="analytics-container">

        <h1 className="analytics-title">Analytics & Progress</h1>
        <p className="analytics-subtitle">
          Visualize your performance and track your learning journey.
        </p>

        {/* TOP SUMMARY CARDS */}
        <div className="summary-cards">
          <div className="summary-card blue">
            <p className="label">Total Modules</p>
            <h2 className="value">0</h2>
          </div>

          <div className="summary-card green">
            <p className="label">Completed</p>
            <h2 className="value">0</h2>
          </div>

          <div className="summary-card purple">
            <p className="label">Overall Score</p>
            <h2 className="value">0%</h2>
          </div>

          <div className="summary-card orange">
            <p className="label">Learning Hours</p>
            <h2 className="value">0 hrs</h2>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <div className="overall-box">
          <h3>Your Overall Progress</h3>

          <div className="overall-bar">
            <div
              className="overall-fill"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>

          <p className="overall-percent">{overallProgress}% Completed</p>
        </div>

        {/* MODULE-WISE PROGRESS */}
        <h3 className="module-title">Module-wise Progress</h3>

        <div className="module-list">

          <div className="module-item">
            <p>Aptitude Basics</p>
            <div className="module-bar">
              <div className="module-fill" style={{ width: "0%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div className="module-item">
            <p>Technical MCQs</p>
            <div className="module-bar">
              <div className="module-fill" style={{ width: "0%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div className="module-item">
            <p>Soft Skills Training</p>
            <div className="module-bar">
              <div className="module-fill" style={{ width: "0%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div className="module-item">
            <p>Coding Challenges</p>
            <div className="module-bar">
              <div className="module-fill" style={{ width: "0%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div className="interview-score">
          <h3>Interview Marks</h3>
          <div className="score-box">
            <p>{interviewMarks} / 100</p>
          </div>
          </div>

         </div>

      </div>

    </StudentLayout>
  );
};

export default AnalyticsProgress;
