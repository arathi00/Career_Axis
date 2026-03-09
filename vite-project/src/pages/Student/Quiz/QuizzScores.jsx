import React, { useEffect, useState } from "react";
import "@/styles/QuizStyles.css";
import { useNavigate } from "react-router-dom";

export default function QuizzScores(){
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("quiz_attempts") || "[]");
      setAttempts(data);
    } catch (err) {
      setAttempts([]);
    }
  }, []);

  return (
    <div className="quiz-page">
      <h1 className="quiz-title">My Quiz Attempts</h1>
      {attempts.length === 0 ? (
        <p>No attempts found. Try completing some quizzes.</p>
      ) : (
        <div className="attempts-list">
          {attempts.map((a, i) => (
            <div key={i} className="attempt-card">
              <div className="attempt-left">
                <h3>{a.title}</h3>
                <p className="muted">{new Date(a.date).toLocaleString()}</p>
                <div className="topic-meta" style={{marginTop:8}}>
                  {a.timeTakenSec !== undefined && <span className="meta-badge">⏱ {Math.ceil(a.timeTakenSec/60)} mins</span>}
                  <span className="meta-badge">{a.total} questions</span>
                  <span className="meta-badge">⭐ {a.percentage}%</span>
                </div>
              </div>
              <div className="attempt-right">
                <div className="score-large">{a.score} / {a.total}</div>
                <button className="start-btn" onClick={() => navigate(`/student/quiz/result`, { state: { score: a.score, total: a.total, attempt: a } })}>View Result</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}