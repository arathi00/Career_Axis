import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components.css";

const QuickActions = () => {
  return (
    <div className="quick-actions-grid">
      <Link to="/student/resume" className="action-card">Resume Builder</Link>
      <Link to="/student/quiz" className="action-card">Take Quiz</Link>
      <Link to="/student/interview" className="action-card">Mock Interview</Link>
      <Link to="/student/chatbot" className="action-card">Chatbot</Link>
    </div>
  );
};

export default QuickActions;
