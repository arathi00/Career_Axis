import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const TrainerLayout = ({ children }) => {
  return (
    <div className="layout-container">

      {/* FIX 1: Navbar must be FIRST for correct spacing */}
      <Navbar />

      <div className="layout-body">

        {/* FIX 2: Sidebar appears below navbar */}
        <Sidebar role="trainer" />

        {/* FIX 3: Main content now aligns perfectly */}
        <div className="layout-main">
          <div className="trainer-page-container">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerLayout;
