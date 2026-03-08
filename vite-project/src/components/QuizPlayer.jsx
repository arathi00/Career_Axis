import React, { useState, useEffect } from 'react';
import { fetchQuizById, submitQuizAnswers } from '../api/quizApi';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Quiz Player Component
 * Displays quiz questions and handles user answers
 */
const QuizPlayer = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(quizId);
        setQuiz(data);
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.question_id] = '';
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Failed to load quiz:', error);
        alert('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption
    });
  };

  const handleSubmit = async () => {
    // Check if all questions answered
    const unanswered = Object.values(answers).filter(a => !a).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers)
        .filter(([_, answer]) => answer) // Only include answered questions
        .map(([questionId, selectedAnswer]) => ({
          question_id: parseInt(questionId),
          selected_answer: selectedAnswer
        }));

      const result = await submitQuizAnswers(quizId, formattedAnswers);
      
      // Navigate to results page or show results
      console.log('Quiz Result:', result);
      navigate(`/quiz/${quizId}/result`, { state: { result } });
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz: ' + (error.response?.data?.detail || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="quiz-error">Quiz not found</div>;
  }

  const answeredCount = Object.values(answers).filter(a => a).length;
  const progress = (answeredCount / quiz.question_count) * 100;

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h2>{quiz.company} - {quiz.topic}</h2>
        <div className="quiz-meta">
          <span className="difficulty">{quiz.difficulty}</span>
          <span className="question-count">{quiz.question_count} Questions</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
          <span className="progress-text">
            {answeredCount} / {quiz.question_count} answered
          </span>
        </div>
      </div>

      <div className="questions-container">
        {quiz.questions.map((question, index) => (
          <div key={question.question_id} className="question-card">
            <h3 className="question-number">Question {index + 1}</h3>
            <p className="question-text">{question.question}</p>
            
            <div className="options-list">
              {question.options.map((option, optionIndex) => (
                <label 
                  key={optionIndex} 
                  className={`option-label ${
                    answers[question.question_id] === option ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.question_id}`}
                    value={option}
                    checked={answers[question.question_id] === option}
                    onChange={() => handleAnswerChange(question.question_id, option)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-actions">
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
