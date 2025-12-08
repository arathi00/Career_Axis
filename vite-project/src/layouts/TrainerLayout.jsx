import React from "react";
import Sidebar from "../components/Trainer/Sidebar";

const TrainerLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default TrainerLayout;
