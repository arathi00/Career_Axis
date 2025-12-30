import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/components.css";

const StudentLayout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* BODY: SIDEBAR + CONTENT */}
      <div className="layout-body">
              <Sidebar role="student" />

        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
