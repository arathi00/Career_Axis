import React, { useState } from "react";
import TrainerLayout from "../../layouts/TrainerLayout";
import "../../styles/TrainerDashboard.css";

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Students");
  const [search, setSearch] = useState("");

  // Example temporary data (replace with API later)
  const stats = [
    { label: "Total Students", value: 24, color: "#5a84f7", bg: "#eaf1ff" },
    { label: "Active Modules", value: 12, color: "#34c759", bg: "#e9f8ee" },
    { label: "Avg Progress", value: "78%", color: "#a855f7", bg: "#f4eaff" },
    { label: "Sessions Today", value: 6, color: "#f97316", bg: "#fff3e6" },
  ];

  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      current: "Advanced Interview Techniques",
      progress: 85,
      modulesDone: 8,
      modulesTotal: 12,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "David Miller",
      email: "david.m@university.edu",
      current: "Technical Aptitude",
      progress: 72,
      modulesDone: 5,
      modulesTotal: 10,
      lastActive: "5 hours ago",
    },
  ];

  return (
    <TrainerLayout>
      <div className="trainer-dashboard">

        {/* Page Title */}
        <h1 className="trainer-title">Trainer Dashboard</h1>
        <p className="trainer-subtitle">Manage students and track training progress</p>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((s, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ background: s.bg, borderColor: s.color }}
            >
              <div>
                <p className="stat-title">{s.label}</p>
                <h3 className="stat-value">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["Students", "Modules", "Assessments", "Analytics"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="filter-btn">Filter</button>
        </div>

        {/* Students List */}
        <div className="student-list">
          {students.map((s) => {
            const initials = s.name.split(" ").map((n) => n[0]).join("");

            return (
              <div key={s.id} className="student-card">
                <div className="student-left">
                  <div className="avatar">{initials}</div>
                  <div>
                    <h4 className="student-name">{s.name}</h4>
                    <p className="student-email">{s.email}</p>
                    <p className="student-current">Current: {s.current}</p>
                  </div>
                </div>

                <div className="student-right">
                  <p className="last-active">{s.lastActive}</p>
                  <p className="progress-text">{s.progress}%</p>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${s.progress}%` }}
                    ></div>
                  </div>

                  <p className="modules-count">
                    {s.modulesDone}/{s.modulesTotal} modules
                  </p>

                  <button className="view-btn">View Details</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerDashboard;
