import React from "react";
import TrainerLayout from "../../layouts/TrainerLayout";
import Card from "../../components/UI/Card";

import { FaVideo, FaClipboardList, FaChartLine, FaUsers } from "react-icons/fa";

const TrainerDashboard = () => {
  return (
    <TrainerLayout>
      <div className="trainer-dashboard">

        <h1 className="dashboard-title">Welcome, Trainer!</h1>
        <p className="dashboard-subtitle">Manage interviews & track student progress</p>

        {/* Quick Actions */}
        <div className="quick-actions">
          
          <Card 
            title="Schedule Interview"
            icon={<FaVideo />}
            link="/trainer/schedule-interview"
          />

          <Card 
            title="Interview Sessions"
            icon={<FaClipboardList />}
            link="/trainer/interviews"
          />

          <Card 
            title="Student Performance"
            icon={<FaChartLine />}
            link="/trainer/student-performance"
          />

          <Card 
            title="Manage Students"
            icon={<FaUsers />}
            link="/trainer/students"
          />

        </div>

      </div>
    </TrainerLayout>
  );
};

export default TrainerDashboard;
