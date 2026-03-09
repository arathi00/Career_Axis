import React from "react";
import "../../styles/AdminDashboard.css";

import { FaUsers, FaUserTie, FaClipboardList, FaChartPie, FaBell } from "react-icons/fa";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Students", value: 1247, className: "stat blue" },
    { title: "Active Trainers", value: 48, className: "stat green" },
    { title: "Total Modules", value: 32, className: "stat purple" },
    { title: "Pending Approvals", value: 6, className: "stat orange" },
  ];

  return (
    <div className="admin-container">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Monitor system activity and manage platform operations
          </p>
        </div>

        <div className="admin-header-right">
          <FaBell className="admin-icon" />
          <div className="admin-profile">AD</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className={`stats-card ${item.className}`}>
            <p className="stats-title">{item.title}</p>
            <h2 className="stats-value">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Overview Section */}
      <div className="overview-card">
        <h2 className="section-title">Platform Overview</h2>
        <p className="section-desc">
          View user activity, manage trainers and students, update modules, and monitor performance.
        </p>
      </div>

      {/* Features Section */}
      <div className="features-grid">
        <div className="feature-card">
          <FaUsers className="feature-icon purple-text" />
          <h3 className="feature-title">Manage Students</h3>
          <p className="feature-desc">Add, remove, or update student accounts</p>
        </div>

        <div className="feature-card">
          <FaUserTie className="feature-icon green-text" />
          <h3 className="feature-title">Manage Trainers</h3>
          <p className="feature-desc">Approve or review trainer applications</p>
        </div>

        <div className="feature-card">
          <FaClipboardList className="feature-icon blue-text" />
          <h3 className="feature-title">Manage Assessments</h3>
          <p className="feature-desc">Edit and assign assessments</p>
        </div>

        <div className="feature-card">
          <FaChartPie className="feature-icon orange-text" />
          <h3 className="feature-title">System Analytics</h3>
          <p className="feature-desc">Track platform-wide performance</p>
        </div>
      </div>
    </div>
  );
}