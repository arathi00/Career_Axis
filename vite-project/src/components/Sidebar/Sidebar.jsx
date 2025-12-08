import React, { useState } from "react";
import {
  FaHome,
  FaFileAlt,
  FaStar,
  FaComments,
  FaChalkboardTeacher,
  FaBars,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FaBars />
      </button>

      <nav className="sidebar-menu">
        <Link to="/student/dashboard" className="sidebar-item">
          <FaHome className="sidebar-icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link to="/student/resume" className="sidebar-item">
          <FaFileAlt className="sidebar-icon" />
          {!isCollapsed && <span>Resume Builder</span>}
        </Link>

        <Link to="/student/quiz" className="sidebar-item">
          <FaStar className="sidebar-icon" />
          {!isCollapsed && <span>Quizzes</span>}
        </Link>

        <Link to="/student/interview" className="sidebar-item">
          <FaChalkboardTeacher className="sidebar-icon" />
          {!isCollapsed && <span>Interviews</span>}
        </Link>

        <Link to="/student/chatbot" className="sidebar-item">
          <FaComments className="sidebar-icon" />
          {!isCollapsed && <span>Chatbot</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
