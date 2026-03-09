import "./quizResultExact.css";
import React from "react";

export default function QuizResultExact({ attempt = null }) {
  // attempt is optional. If provided, values will be derived from it
  const score = attempt ? attempt.score : 0;
  const total = attempt ? attempt.total : 5;
  const incorrect = total - score;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const company = attempt?.title?.split(" - ")?.[0] || "TCS";
  const type = "Aptitude";
  const level = "easy";

  return (
    <div className="quiz-result-page">

      {/* TOP RESULT CARD */}
      <div className="result-card">

        {/* Header */}
        <div className="result-header">
          <div className="badges">
            <span className="badge company">{company}</span>
            <span className="badge type">{type}</span>
            <span className="badge level">{level}</span>
          </div>

          <div className="score-circle">
            <span>{percentage}%</span>
          </div>
        </div>

        <h1 className="title">Quiz Completed!</h1>
        <p className={`subtitle ${percentage < 60 ? 'danger' : 'success'}`}>
          {percentage < 60 ? 'Needs improvement. Study and try again.' : 'Great job — keep practicing.'}
        </p>

        {/* Stats */}
        <div className="stats">
          <div className="stat correct">
            <div className="icon">✓</div>
            <h2>{score}</h2>
            <p>Correct</p>
          </div>

          <div className="stat incorrect">
            <div className="icon">✕</div>
            <h2>{incorrect}</h2>
            <p>Incorrect</p>
          </div>

          <div className="stat total">
            <div className="icon">◎</div>
            <h2>{total}</h2>
            <p>Total</p>
          </div>
        </div>
      </div>

      {/* REVIEW SECTION */}
      <div className="review-card">
        <h2>Review Incorrect Answers</h2>
        <p className="review-sub">
          Understanding your mistakes helps you improve. Here are detailed explanations for each incorrect answer.
        </p>

        {/* Question List */}
        <div className="question-list">
          {(attempt?.qa || [
            { q: 'If a train travels 360 km in 4 hours, what is its speed in km/hr?', level: 'easy' },
            { q: 'What is 25% of 200?', level: 'easy' },
            { q: 'If 5 workers can complete a job in 10 days, how many days will 10 workers take?', level: 'easy' },
            { q: 'A shopkeeper sells an article at 20% profit. If the cost price is ₹500 what is the selling price?', level: 'easy' },
            { q: 'The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?', level: 'easy' }
          ]).map((item, idx) => (
            <div key={idx} className="question wrong">
              <div className="q-head">
                <span className="q-no">Q{idx + 1}</span>
                <span className="q-text">{item.q}</span>
                <span className={`tag ${item.level || 'easy'}`}>{item.level || 'easy'}</span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
