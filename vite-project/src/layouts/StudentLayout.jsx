import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/components.css";

const StudentLayout = () => {
  return (
    <div className="layout-container">
      <Navbar />

      <div className="layout-content">
        <Sidebar />

        <main className="layout-main">
          <Outlet />   {/* 👈 THIS IS REQUIRED */}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
