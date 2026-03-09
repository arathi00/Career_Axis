import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

import { FaUsers, FaUserTie, FaClipboardList, FaChartPie, FaBell } from "react-icons/fa";
import axios from "axios";

export default function AdminDashboard() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        "http://127.0.0.1:8000/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = res.data;

      setStats([
        {
          title: "Total Students",
          value: data.students.total,
          className: "stat blue"
        },
        {
          title: "Active Students",
          value: data.students.active,
          className: "stat green"
        },
        {
          title: "Total Trainers",
          value: data.trainers.total,
          className: "stat purple"
        },
        {
          title: "Pending Trainer Approvals",
          value: data.trainers.pending,
          className: "stat orange"
        }
      ]);

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

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

          <div
            className="admin-profile"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            AD
          </div>

          {menuOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/admin/profile")}>Profile</button>
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

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

        <div
          className="feature-card"
          onClick={() => navigate("/admin/manage-students")}
          style={{ cursor: "pointer" }}
        >
          <FaUsers className="feature-icon purple-text" />
          <h3 className="feature-title">Manage Students</h3>
          <p className="feature-desc">Add, remove, or update student accounts</p>
        </div>

        <div
          className="feature-card"
          onClick={() => navigate("/admin/manage-trainers")}
          style={{ cursor: "pointer" }}
        >
          <FaUserTie className="feature-icon green-text" />
          <h3 className="feature-title">Manage Trainers</h3>
          <p className="feature-desc">Approve or review trainer applications</p>
        </div>

        <div
          className="feature-card"
          onClick={() => navigate("/admin/manage-assessments")}
          style={{ cursor: "pointer" }}
        >
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