import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultSummary from "@/components/Assessment/ResultSummary";
import "./assessment.css";

export default function QuizResult(){
  const { state } = useLocation();
  const navigate = useNavigate();
  const attempt = state?.attempt;
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!attempt) return <div style={{padding:24}}>No result to show.</div>;

  const incorrect = attempt.total - attempt.score;
  const needsImprovement = attempt.percentage < 50;
  const meta = attempt.meta || {};

  // Get incorrect answers only
  const incorrectAnswers = attempt.qa.filter((q,i) => attempt.selectedAnswers && attempt.selectedAnswers[i] !== q.answer);

  return (
    <div className="container quiz-result-page">
      {/* Header with Badges */}
      <div className="result-header-section">
        <div className="result-badges">
          <span className="badge-company">{meta.company}</span>
          <span className="badge-type">{meta.type}</span>
          <span className={`badge-level badge-${meta.level?.toLowerCase()}`}>{meta.level}</span>
        </div>
      </div>

      {/* Result Summary Card */}
      <div className={`result-summary-card ${needsImprovement ? 'needs-improvement' : 'good-performance'}`}>
        <div className="result-left">
          <h1>Quiz Completed!</h1>
          <p className={needsImprovement ? 'text-danger' : 'text-success'}>
            {needsImprovement ? 'Needs improvement. Study and try again.' : 'Great job — keep practicing.'}
          </p>
        </div>
        <div className="result-score-circle">
          <div className="score-value">{attempt.percentage}%</div>
        </div>
      </div>

      {/* Result Stats */}
      <div className="result-stats">
        <div className="stat-card stat-correct">
          <div className="stat-icon">✓</div>
          <div className="stat-number">{attempt.score}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-card stat-incorrect">
          <div className="stat-icon">✕</div>
          <div className="stat-number">{incorrect}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="stat-card stat-total">
          <div className="stat-icon">◯</div>
          <div className="stat-number">{attempt.total}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Review Incorrect Answers */}
      {incorrectAnswers.length > 0 && (
        <section className="review-section">
          <div className="review-header">
            <span className="review-icon">⚠️</span>
            <div>
              <h2>Review Incorrect Answers</h2>
              <p>Understanding your mistakes helps you improve. Here are detailed explanations for each incorrect answer.</p>
            </div>
          </div>
          <div className="review-list">
            {incorrectAnswers.map((q, idx) => {
              const qIndex = attempt.qa.indexOf(q);
              const isExpanded = expandedQuestion === qIndex;
              return (
                <div key={idx} className="review-item">
                  <button 
                    className="review-item-button"
                    onClick={() => setExpandedQuestion(isExpanded ? null : qIndex)}
                  >
                    <div className="review-item-header">
                      <span className="review-q-number">Q{qIndex+1}</span>
                      <span className="review-q-text">{q.q}</span>
                    </div>
                    <span className="review-toggle">{isExpanded ? '−' : '+'}</span>
                  </button>
                  {isExpanded && (
                    <div className="review-item-details">
                      <p><strong>Your answer:</strong> {attempt.selectedAnswers[qIndex] !== undefined ? q.options[attempt.selectedAnswers[qIndex]] : 'No answer'}</p>
                      <p><strong>Correct answer:</strong> {q.options[q.answer]}</p>
                      <p className="explanation"><strong>Explanation:</strong> {q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Questions Summary */}
      <section className="summary-section">
        <h2>All Questions Summary</h2>
        <div className="questions-summary-list">
          {attempt.qa.map((q, i) => (
            <div key={i} className="summary-item">
              <div className="summary-left">
                <span className="summary-q-number">Q{i+1}:</span>
                <span className="summary-q-text">{q.q}</span>
              </div>
              <span className="summary-difficulty">easy</span>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="result-actions">
        <button className="btn-retry" onClick={() => navigate(`/student/assessments/quiz?company=${encodeURIComponent(meta.company)}&type=${encodeURIComponent(meta.type)}&level=${encodeURIComponent(meta.level)}`)}>
          ↻ Retry Quiz
        </button>
        <button className="btn-back-companies" onClick={() => navigate('/student/assessments')}>
          ← Back to Companies
        </button>
      </div>
    </div>
  );
}