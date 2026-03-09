import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/components.css";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="layout-body">
        <Sidebar role="admin" />

        <main className="layout-main">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
