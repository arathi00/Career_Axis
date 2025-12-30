import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/styles/QuizStyles.css";

export default function QuizReview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { questions, selected, score, total } = state;

  return (
    <div className="quiz-review">
      <h2>Review Answers</h2>

      {questions.map((q, i) => (
        <div className="review-card" key={i}>
          <h4>Q{i + 1}: {q.q}</h4>

          {q.options.map((opt, j) => (
            <p
              className={
                j === q.answer
                  ? "correct"
                  : j === selected[i]
                  ? "wrong"
                  : ""
              }
              key={j}
            >
              {opt}
            </p>
          ))}
        </div>
      ))}

      <button
        className="submit-btn"
        onClick={() =>
          navigate("/student/quiz/result", { state: { score, total } })
        }
      >
        Confirm Submit
      </button>
    </div>
  );
}
