/**
 * Company Quiz Component - Complete Frontend Example
 * Shows how to integrate with the company-specific quiz system
 */

import React, { useState, useEffect } from 'react';
import { startQuiz, submitQuiz, getCompanies } from '../api/companyQuizApi';
import './CompanyQuiz.css';

const CompanyQuiz = () => {
  // ============= State Management =============
  
  // Quiz selection state
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('TCS');
  const [selectedLevel, setSelectedLevel] = useState('easy');
  const [questionCount, setQuestionCount] = useState(10);
  
  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  
  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  // ============= Effects =============
  
  useEffect(() => {
    // Fetch available companies on mount
    fetchCompanies();
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit quiz when time is up
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);
  
  // ============= API Calls =============
  
  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };
  
  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 🚀 Call backend to start quiz
      // This triggers Gemini API internally if needed
      const quizData = await startQuiz(
        selectedCompany,
        selectedLevel,
        questionCount,
        "Aptitude"
      );
      
      setQuiz(quizData);
      setQuizStarted(true);
      setTimeLeft(600); // Reset timer
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
    } catch (err) {
      setError(`Failed to start quiz: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare answers in the format backend expects
      const answers = quiz.questions.map(q => ({
        question_id: q.id,
        selected_answer: userAnswers[q.id] || null
      }));
      
      // Submit quiz and get results
      const resultData = await submitQuiz(quiz.session_id, answers);
      
      setResult(resultData);
      setQuizCompleted(true);
    } catch (err) {
      setError(`Failed to submit quiz: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // ============= Helper Functions =============
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getCurrentQuestion = () => {
    return quiz?.questions[currentQuestionIndex];
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // ============= Render Sections =============
  
  // Quiz Selection Screen
  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-setup">
          <h1>🎯 Company Placement Quiz</h1>
          
          <div className="setup-form">
            <div className="form-group">
              <label>Select Company:</label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companies.map(company => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Difficulty Level:</label>
              <div className="level-buttons">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    className={`level-btn ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Number of Questions:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button
              className="start-btn"
              onClick={handleStartQuiz}
              disabled={loading}
            >
              {loading ? '⏳ Starting Quiz...' : '🚀 Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz Completed - Show Results
  if (quizCompleted && result) {
    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <h2>📊 Quiz Results</h2>
          
          <div className="result-summary">
            <div className="score-card">
              <div className="score-value">{result.percentage}%</div>
              <div className="score-text">Score</div>
            </div>
            
            <div className="stats">
              <div className="stat">
                <strong>Correct:</strong> {result.score}/{result.total}
              </div>
              <div className="stat">
                <strong>Company:</strong> {result.company}
              </div>
              <div className="stat">
                <strong>Level:</strong> {result.level}
              </div>
            </div>
          </div>
          
          <div className="answers-review">
            <h3>📝 Answer Review</h3>
            {result.answers.map((answer, idx) => (
              <div 
                key={idx}
                className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}
              >
                <div className="answer-header">
                  <span className="question-number">Q{idx + 1}</span>
                  <span className={`result-badge ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                    {answer.is_correct ? '✅ Correct' : '❌ Incorrect'}
                  </span>
                </div>
                
                <p className="question-text">{answer.question_text}</p>
                
                <div className="options">
                  {answer.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`option
                        ${option === answer.selected_answer ? 'selected' : ''}
                        ${option === answer.correct_answer ? 'correct-answer' : ''}
                      `}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                
                {answer.explanation && (
                  <div className="explanation">
                    <strong>💡 Explanation:</strong> {answer.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            className="restart-btn"
            onClick={() => {
              setQuizStarted(false);
              setQuizCompleted(false);
              setResult(null);
            }}
          >
            🔄 Try Another Quiz
          </button>
        </div>
      </div>
    );
  }
  
  // Active Quiz - Question Display
  const currentQuestion = getCurrentQuestion();
  
  return (
    <div className="quiz-container">
      <div className="quiz-active">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>{quiz.company} - {quiz.level.toUpperCase()}</h2>
            <span className="question-counter">
              Question {currentQuestionIndex + 1}/{quiz.total_questions}
            </span>
          </div>
          <div className="timer" style={{color: timeLeft < 60 ? '#ff6b6b' : '#4ecdc4'}}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{width: `${((currentQuestionIndex + 1) / quiz.total_questions) * 100}%`}}
          />
        </div>
        
        {/* Question */}
        <div className="question-section">
          <h3>{currentQuestion.question_text}</h3>
          
          <div className="options-container">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${
                  userAnswers[currentQuestion.id] === option ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="navigation">
          <button
            className="nav-btn"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          
          <div className="nav-counter">
            {currentQuestionIndex + 1} / {quiz.total_questions}
          </div>
          
          {currentQuestionIndex === quiz.total_questions - 1 ? (
            <button
              className="submit-btn"
              onClick={handleSubmitQuiz}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Quiz ✓'}
            </button>
          ) : (
            <button
              className="nav-btn"
              onClick={handleNextQuestion}
            >
              Next →
            </button>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default CompanyQuiz;
