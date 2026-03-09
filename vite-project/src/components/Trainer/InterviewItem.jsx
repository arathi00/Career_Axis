// src/components/Trainer/InterviewItem.jsx
import React from "react";

const InterviewItem = ({ interview }) => {
  const { studentName, displayTime, meetingLink, status } = interview;

  return (
    <div className="student-card" style={{ alignItems: "center" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="avatar">{studentName.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
        <div>
          <div className="student-name">{studentName}</div>
          <div className="muted">{displayTime}</div>
        </div>
      </div>

      <div style={{ textAlign: "right", minWidth: 200 }}>
        <div className="muted">Status: <strong>{status}</strong></div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <a href={meetingLink} className="view-btn" target="_blank" rel="noreferrer">Join</a>
          <button className="view-btn">Mark Done</button>
        </div>
      </div>
    </div>
  );
};

export default InterviewItem;
