import React, { useState, useEffect } from "react";
import "@/styles/QuizStyles.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizById } from "@/api/quizApi";  

  

export default function QuizzAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  // QUESTIONS: fetched from backend
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch quiz by id
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchQuizById(id)
      .then((data) => {
        if (mounted) setQuestions(data.questions || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load quiz");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [id]);

  // TIMER (10 minutes)
  const INITIAL_TIME = 600; // seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const startRef = React.useRef(Date.now());

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

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

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!loading && questions.length === 0) return <div>No questions available</div>;

  const q = questions[index];

  const handleNext = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = () => {
    let score = 0;

    const qa = questions.map((q, i) => {
      if (selected[i] === q.answer) score++;
      return {
        q: q.q,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation || `Correct answer: ${q.options[q.answer]}`,
      };
    });

    // clear autosaved progress
    localStorage.removeItem("quiz-progress");

    // compute time taken (seconds)
    const timeTakenSec = Math.max(0, INITIAL_TIME - timeLeft);

    // build attempt record and persist to localStorage
    const attempt = {
      quizId: Number(id),
      title: questions[0]?.title || `Quiz ${id}`,
      score,
      total: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
      timeTakenSec,
      date: new Date().toISOString(),
      qa,
      selectedAnswers: Object.keys(selected).length ? selected : undefined,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("quiz_attempts") || "[]");
      existing.unshift(attempt); // latest first
      localStorage.setItem("quiz_attempts", JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to save quiz attempt", err);
    }

    // pass attempt to results page so it can display immediately
    navigate("/student/quiz/result", {
      state: { score, total: questions.length, attempt },
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
