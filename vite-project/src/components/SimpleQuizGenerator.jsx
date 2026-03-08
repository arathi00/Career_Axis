import React, { useState } from 'react';
import { generateSimpleQuiz, getGeneratedQuiz } from '../api/quizApi';
import '../styles/Quiz.css';

/**
 * Simple Quiz Generator - Gemini to Database
 * Generates quiz questions and saves directly to PostgreSQL
 */
const SimpleQuizGenerator = () => {
  const [formData, setFormData] = useState({
    company: 'TCS',
    topic: 'Aptitude',
    difficulty: 'easy',
    num_questions: 5
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_questions' ? parseInt(value) : value
    }));
  };

  // Generate quiz
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setGeneratedQuiz(null);

    try {
      console.log('Generating quiz with data:', formData);
      
      // Generate quiz using Gemini
      const response = await generateSimpleQuiz(formData);
      
      console.log('Quiz generated:', response);
      setResult(response);

      // Fetch the generated quiz with questions
      if (response.quiz_id) {
        const quizData = await getGeneratedQuiz(response.quiz_id);
        console.log('Quiz data fetched:', quizData);
        setGeneratedQuiz(quizData);
      }

    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-generator-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🎯 Simple Quiz Generator</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Generate quiz questions using AI and save directly to database
      </p>

      <form onSubmit={handleGenerateQuiz} className="quiz-form">
        {/* Company Selection */}
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-control"
          >
            <option value="TCS">TCS</option>
            <option value="Infosys">Infosys</option>
            <option value="Wipro">Wipro</option>
            <option value="Accenture">Accenture</option>
            <option value="Cognizant">Cognizant</option>
            <option value="Amazon">Amazon</option>
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
          </select>
        </div>

        {/* Topic Selection */}
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="form-control"
          >
            <option value="Aptitude">Aptitude</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="Verbal Ability">Verbal Ability</option>
            <option value="Technical - Programming">Technical - Programming</option>
            <option value="Technical - Data Structures">Technical - Data Structures</option>
            <option value="Technical - Algorithms">Technical - Algorithms</option>
          </select>
        </div>

        {/* Difficulty Selection */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="form-control"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Number of Questions */}
        <div className="form-group">
          <label htmlFor="num_questions">Number of Questions</label>
          <input
            type="number"
            id="num_questions"
            name="num_questions"
            value={formData.num_questions}
            onChange={handleChange}
            min="1"
            max="20"
            className="form-control"
          />
          <small style={{ color: '#666' }}>Between 1 and 20 questions</small>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: 'white',
            marginTop: '10px'
          }}
        >
          {loading ? '🔄 Generating...' : '✨ Generate Quiz'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Success Message */}
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          <h3>✅ Success!</h3>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Quiz ID:</strong> {result.quiz_id}</p>
          <p><strong>Questions Saved:</strong> {result.questions_saved}</p>
        </div>
      )}

      {/* Display Generated Quiz */}
      {generatedQuiz && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <h3>📝 Generated Quiz Details</h3>
          
          {/* Quiz Info */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <p><strong>Company:</strong> {generatedQuiz.quiz.company}</p>
            <p><strong>Topic:</strong> {generatedQuiz.quiz.topic}</p>
            <p><strong>Difficulty:</strong> {generatedQuiz.quiz.difficulty}</p>
            <p><strong>Total Questions:</strong> {generatedQuiz.total_questions}</p>
          </div>

          {/* Questions List */}
          <h4>Questions:</h4>
          {generatedQuiz.questions.map((q, index) => (
            <div key={q.id} style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              borderLeft: '4px solid #007bff'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Q{index + 1}. {q.question}
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {q.options.map((option, optIndex) => (
                  <li 
                    key={optIndex} 
                    style={{
                      padding: '8px',
                      margin: '5px 0',
                      backgroundColor: option === q.correct_answer ? '#d4edda' : '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option}
                    {option === q.correct_answer && ' ✓'}
                  </li>
                ))}
              </ul>
              
              {q.explanation && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  <strong>💡 Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleQuizGenerator;
