import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ role = "student", userName = "Arathi" }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <div className="logo">Career<span>Axis</span></div>
      </div>
      
      {/* Right */}
      <div className="navbar-right">
        <button className="icon-btn">
          🔔
        </button>

        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span>{userName}</span>
        </div>

        {open && (
          <div className="dropdown">
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
            <button className="logout">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
