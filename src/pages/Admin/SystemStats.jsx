import React, { useEffect, useState } from "react";
import { getOverview } from "../../api/adminAnalyticsApi";

export default function SystemStats() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    getOverview().then(res => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="admin-stats">

      <h2>System Analytics</h2>

      <div className="stats-grid">

        <div className="card">
          <h3>Total Students</h3>
          <p>{stats.total_students}</p>
        </div>

        <div className="card">
          <h3>Interviews</h3>
          <p>{stats.interviews_this_month}</p>
        </div>

        <div className="card">
          <h3>Chatbot Usage</h3>
          <p>{stats.chatbot_queries}</p>
        </div>

      </div>

    </div>
  );
}