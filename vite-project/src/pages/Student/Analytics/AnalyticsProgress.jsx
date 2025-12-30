import React from "react";
import "../../../styles/Analytics.css";

const AnalyticsProgress = () => {
  const modules = [
    { name: "Aptitude Basics", progress: 0 },
    { name: "Technical MCQs", progress: 0 },
    { name: "Soft Skills", progress: 0 },
    { name: "Coding", progress: 0 },
  ];

  const interviews = [
    { date: "2025-01-10", type: "Technical", score: "72%" },
    { date: "2025-01-18", type: "HR", score: "80%" },
    { date: "2025-02-02", type: "Mock Interview", score: "65%" },
  ];

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <h2>Analytics & Progress</h2>
        <p>Visualize your performance and track your learning journey.</p>
      </div>

      {/* Stat Cards */}
      <div className="analytics-cards">
        <div className="stat-card blue">
          <p>Total Modules</p>
          <h3>4</h3>
        </div>
        <div className="stat-card green">
          <p>Completed</p>
          <h3>0</h3>
        </div>
        <div className="stat-card purple">
          <p>Avg Interview Score</p>
          <h3>72%</h3>
        </div>
        <div className="stat-card orange">
          <p>Mock Interviews</p>
          <h3>3</h3>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="analytics-box">
        <h4>Your Overall Progress</h4>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "0%" }} />
        </div>
        <span className="progress-text">0% Completed</span>
      </div>

      {/* Module Progress */}
      <div className="analytics-box">
        <h4>Assessment Progress</h4>
        {modules.map((mod, index) => (
          <div key={index} className="module-row">
            <span>{mod.name}</span>
            <div className="progress-bar small">
              <div
                className="progress-fill"
                style={{ width: `${mod.progress}%` }}
              />
            </div>
            <span className="percent">{mod.progress}%</span>
          </div>
        ))}
      </div>

      {/* Mock Interview History */}
      <div className="analytics-box">
        <h4>Mock Interview History</h4>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Interview Type</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td className="score">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsProgress;
