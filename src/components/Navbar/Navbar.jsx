import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("User");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      setDisplayName(user.name || user.email);
      setRole(user.role); // ✅ IMPORTANT
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <div className="logo">
          Career<span>Axis</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <button className="icon-btn">🔔</button>

        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          {/* ✅ ROLE BASED LABEL */}
          <span>
            {role === "trainer" ? "Trainer" : "Student"}
          </span>
        </div>

        {open && (
          <div className="dropdown">
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>

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
