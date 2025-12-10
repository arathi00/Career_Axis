import React from "react";
import { FaBell } from "react-icons/fa";
import "../../styles/components.css";

const Navbar = () => {
  return (
    <div className="top-navbar">
      
      {/* LEFT SIDE — Logo + Title */}
      <div className="nav-left">
        <img src="/logo192.png" alt="logo" className="nav-logo" />
        <div>
          <h3 className="nav-title">Career Axis</h3>
          <p className="nav-subtitle">AI-Powered Training</p>
        </div>
      </div>

      {/* RIGHT SIDE — Notification + Profile */}
      <div className="nav-right">
        <FaBell className="nav-icon" />
        
        <div className="nav-profile">
          <span className="profile-circle">ST</span>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
