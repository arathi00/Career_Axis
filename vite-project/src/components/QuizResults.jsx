import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Quiz Results Component
 * Shows score, percentage, and review of all questions with correct answers
 */
const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    return (
      <div className="results-error">
        <h2>No results found</h2>
        <button onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  const { quiz_id, score, total, percentage, questions } = result;

  const getScoreColor = (percent) => {
    if (percent >= 80) return 'green';
    if (percent >= 60) return 'orange';
    return 'red';
  };

  return (
    <div className="quiz-results">
      {/* Score Summary */}
      <div className="results-header">
        <h1>Quiz Results</h1>
        <div className="score-card" style={{ borderColor: getScoreColor(percentage) }}>
          <div className="score-percentage" style={{ color: getScoreColor(percentage) }}>
            {percentage.toFixed(1)}%
          </div>
          <div className="score-details">
            <span className="score-text">{score} / {total}</span>
            <span className="score-label">Correct Answers</span>
          </div>
        </div>
        
        {percentage >= 80 && <p className="result-message success">🎉 Excellent! Great job!</p>}
        {percentage >= 60 && percentage < 80 && <p className="result-message good">👍 Good effort! Keep practicing.</p>}
        {percentage < 60 && <p className="result-message needs-improvement">📚 Keep learning! Review the explanations below.</p>}
      </div>

      {/* Question Review */}
      <div className="questions-review">
        <h2>Answer Review</h2>
        
        {questions.map((question, index) => {
          const isCorrect = question.correct_answer;
          
          return (
            <div key={question.question_id} className="review-card">
              <div className="review-header">
                <h3>Question {index + 1}</h3>
                <span className={`badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              <p className="review-question">{question.question}</p>
              
              <div className="review-options">
                {question.options.map((option, optIndex) => {
                  const isCorrectAnswer = option === question.correct_answer;
                  
                  return (
                    <div 
                      key={optIndex} 
                      className={`review-option ${
                        isCorrectAnswer ? 'correct-answer' : ''
                      }`}
                    >
                      {isCorrectAnswer && <span className="correct-icon">✓</span>}
                      <span>{option}</span>
                    </div>
                  );
                })}
              </div>

              {/* Correct Answer */}
              <div className="correct-answer-box">
                <strong>Correct Answer:</strong> {question.correct_answer}
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="explanation-box">
                  <strong>Explanation:</strong>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/quizzes')}
        >
          Back to Quizzes
        </button>
        <button 
          className="btn-primary" 
          onClick={() => window.location.reload()}
        >
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
