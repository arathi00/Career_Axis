import React from 'react';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../api/quizApi';
import '../styles/Quiz.css';

/**
 * Quiz List Component
 * Shows all available quizzes with filtering
 */
const QuizList = () => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({
    company: '',
    track: ''
  });

  React.useEffect(() => {
    loadQuizzes();
  }, [filters]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzes(filters);
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="quiz-loading">Loading quizzes...</div>;
  }

  return (
    <div className="quiz-list-container">
      <div className="quiz-list-header">
        <h1>Available Quizzes</h1>
        <Link to="/admin/quiz-generator" className="btn-primary">
          Generate New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>No quizzes available yet.</p>
          <Link to="/admin/quiz-generator">Create your first quiz</Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card-item">
              <div className="quiz-card-header">
                <h3>{quiz.company}</h3>
                <span className="difficulty-badge">{quiz.difficulty}</span>
              </div>
              <div className="quiz-card-body">
                <p className="quiz-topic">{quiz.topic}</p>
                <p className="quiz-meta">
                  {quiz.track} • {quiz.question_count} questions
                </p>
                <p className="quiz-date">
                  Created: {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="quiz-card-footer">
                <Link 
                  to={`/quiz/${quiz.id}`} 
                  className="btn-start-quiz"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
