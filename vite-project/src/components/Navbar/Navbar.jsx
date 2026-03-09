import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ role = "student", userName = "Student" }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 get logged-in user
  const [displayName, setDisplayName] = useState(userName);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setDisplayName(user.name);
    }
  }, []);

  // 🔹 LOGOUT HANDLER (ADDED)
  const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};


  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <div className="logo">
          Career<span>Axis</span>
        </div>
      </div>
      
      {/* Right */}
      <div className="navbar-right">
        <button className="icon-btn">
          🔔
        </button>

        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span>{displayName}</span>
        </div>

        {open && (
          <div className="dropdown">
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>

            {/* 🔹 LOGOUT BUTTON FIXED */}
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
