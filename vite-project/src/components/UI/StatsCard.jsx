import React from "react";
import "../../styles/components.css";

const StatsCard = ({ icon, label, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-left">{icon}</div>
      <div className="stat-right">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;
