import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/styles/QuizStyles.css";

export default function QuizzResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const score = state?.score ?? 0;
  const total = state?.total ?? 0;

  return (
    <div className="quiz-result">
      <h2>Quiz Completed!</h2>

      <div className="result-card">
        <h3>Your Score</h3>
        <h1>{score} / {total}</h1>
        <p>{((score / total) * 100).toFixed(2)}% Accuracy</p>
      </div>

      <button className="back-btn" onClick={() => navigate("/student/quiz")}>
        Back to Quizzes
      </button>
    </div>
  );
}
