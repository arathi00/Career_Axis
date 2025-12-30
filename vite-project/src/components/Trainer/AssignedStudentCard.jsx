// src/components/Trainer/AssignedStudentCard.jsx
import React from "react";

const AssignedStudentCard = ({ student }) => {
  return (
    <div className="student-card">
      <div className="student-left">
        <div className="avatar">{student.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
        <div>
          <h4 className="student-name">{student.name}</h4>
          <p className="student-email">{student.email}</p>
          <p className="student-current muted">Next: {student.nextSession}</p>
        </div>
      </div>

      <div className="student-right">
        <p className="last-active muted">Last interview: {student.lastInterview}</p>
        <p className="progress-text">{student.progress}%</p>

        <div className="progress-bar" aria-hidden>
          <div className="progress-fill" style={{ width: `${student.progress}%` }} />
        </div>

        <button className="view-btn" style={{ marginTop: 10 }}>Give Feedback</button>
      </div>
    </div>
  );
};

export default AssignedStudentCard;
