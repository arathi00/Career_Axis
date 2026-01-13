import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ role = "student" }) => {
  const menus = {
    student: [
      { path: "/student/dashboard", label: "Dashboard", icon: "🏠" },
      { path: "/student/resume", label: "Resume Builder", icon: "📄" },
      { path: "/student/assessments", label: "Quizzes", icon: "📝" },
      { path: "/student/interviews", label: "Interviews", icon: "🎤" },
      { path: "/student/chatbot", label: "Chatbot", icon: "🤖" },
      { path: "/student/analytics", label: "Analytics", icon: "📊" },
    ],

    trainer: [
      { path: "/trainer/dashboard", label: "Dashboard", icon: "🏠" },
      { path: "/trainer/interviews", label: "Interviews", icon: "🎤" },
      { path: "/trainer/students", label: "Students", icon: "👨‍🎓" },
      { path: "/trainer/feedback", label: "Feedback", icon: "📝" },
    ],

    admin: [
      { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
      { path: "/admin/users", label: "Users", icon: "👥" },
      { path: "/admin/trainers", label: "Trainers", icon: "🧑‍🏫" },
      { path: "/admin/reports", label: "Reports", icon: "📈" },
      { path: "/admin/settings", label: "Settings", icon: "⚙️" },
    ],
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        {menus[role].map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
