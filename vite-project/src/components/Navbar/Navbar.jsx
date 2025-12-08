import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Career Axis</h2>
      </div>

      <div className="navbar-right">
        <FaBell className="navbar-icon" />
        <FaUserCircle className="navbar-icon" />
      </div>
    </header>
  );
};

export default Navbar;
