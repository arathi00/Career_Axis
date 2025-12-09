import React from "react";
import Navbar from "../components/Navbar/Navbar";

const TrainerLayout = ({ children }) => {
  return (
    <div className="trainer-layout-wrapper">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="trainer-page-container">
        {children}
      </div>
    </div>
  );
};

export default TrainerLayout;
