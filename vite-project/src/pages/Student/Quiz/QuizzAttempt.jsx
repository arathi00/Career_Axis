import React, { useState, useEffect } from "react";
import "@/styles/QuizStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import "@/utils/questionsData.js";

export default function QuizzAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  // MAP ID → Topic Key
  const topicKey =
    id === "1" ? "aptitude" :
    id === "2" ? "java" :
    "python";

  const questions = questionsData[topicKey] || [];

  // TIMER (10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);

  // QUIZ STATES
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem("quiz-progress"))?.selected || {}
  );

  // AUTO-SAVE ANSWERS
  useEffect(() => {
    localStorage.setItem("quiz-progress", JSON.stringify({ selected }));
  }, [selected]);

  // TIMER RUNNER
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const q = questions[index];

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 10;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNext = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = () => {
    let score = 0;

    questions.forEach((q, i) => {
      if (selected[i] === q.answer) score++;
    });

    localStorage.removeItem("quiz-progress");

    navigate("/student/quiz/result", {
      state: { score, total: questions.length },
    });
  };

  return (
    <div className="quiz-attempt">

      {/* TIMER */}
      <div
        style={{
          background: "#ffffff",
          color: timeLeft <= 60 ? "red" : "#4f46e5",
          fontWeight: "700",
          fontSize: "20px",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px",
          width: "220px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
        }}
      >
        ⏳ Time Left: {formatTime(timeLeft)}
      </div>

      <div className="quiz-header">
        <p>Question {index + 1} of {questions.length}</p>

        {/* Difficulty Badge */}
        <span
          className="difficulty-badge"
          style={{
            background:
              q.difficulty === "Easy"
                ? "#22c55e"
                : q.difficulty === "Medium"
                ? "#f59e0b"
                : "#ef4444",
            color: "white",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "14px"
          }}
        >
          {q.difficulty}
        </span>
      </div>

      <div className="question-box">{q.q}</div>

      <div className="options-list">
        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`option-card ${selected[index] === i ? "selected" : ""}`}
            onClick={() => setSelected({ ...selected, [index]: i })}
          >
            {opt}
          </div>
        ))}
      </div>

      <div className="attempt-nav">
        <button disabled={index === 0} onClick={handlePrev}>Previous</button>

        <button onClick={handleNext}>
          {index === questions.length - 1 ? "Submit Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}
