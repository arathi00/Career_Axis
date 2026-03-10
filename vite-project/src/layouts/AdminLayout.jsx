import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/components.css";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="layout-container">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="layout-body">
        <Sidebar role="admin" />

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
