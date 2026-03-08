import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCompanies, 
  getExamTypes, 
  getCompanyCategories, 
  getTopics, 
  generateAIQuiz 
} from '../api/companyQuizApi';
import '../styles/Quiz.css';

/**
 * Enhanced Quiz Generation Form with Validation
 * Cascading dropdowns: Company → Exam Type → Category → Topic
 */
const QuizGeneratorForm = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    company: '',
    track: '',
    exam_type: '',
    category: '',
    topic: '',
    difficulty: 'Medium',
    num_questions: 10
  });

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to load companies:', error);
        setError('Failed to load companies');
      }
    };
    loadCompanies();
  }, []);

  // Load exam types when company selected
  useEffect(() => {
    const loadExamTypes = async () => {
      if (formData.company) {
        try {
          const data = await getExamTypes(formData.company);
          setExamTypes(data);
          setCategories([]);
          setTopics([]);
        } catch (error) {
          console.error('Failed to load exam types:', error);
        }
      }
    };
    loadExamTypes();
  }, [formData.company]);

  // Load categories when exam type selected
  useEffect(() => {
    const loadCategories = async () => {
      if (formData.company && formData.exam_type) {
        try {
          const data = await getCompanyCategories(formData.company, formData.exam_type);
          setCategories(data);
          setTopics([]);
        } catch (error) {
          console.error('Failed to load categories:', error);
        }
      }
    };
    loadCategories();
  }, [formData.company, formData.exam_type]);

  // Load topics when category selected
  useEffect(() => {
    const loadTopics = async () => {
      if (formData.company && formData.track && formData.exam_type && formData.category) {
        try {
          const data = await getTopics(
            formData.company,
            formData.track,
            formData.exam_type,
            formData.category
          );
          setTopics(data);
        } catch (error) {
          console.error('Failed to load topics:', error);
          setTopics([]);
        }
      }
    };
    loadTopics();
  }, [formData.company, formData.track, formData.exam_type, formData.category]);

  const handleCompanyChange = (e) => {
    const company = e.target.value;
    const companyData = companies.find(c => c.company_name === company);
    
    setFormData({
      ...formData,
      company,
      track: companyData?.track || '',
      exam_type: '',
      category: '',
      topic: '',
    });
    setExamTypes([]);
    setCategories([]);
    setTopics([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getMaxQuestions = () => {
    // Since categories are now just strings, we can't get max from them
    // This should be fetched separately or removed
    return 100; // Default max
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const maxQuestions = getMaxQuestions();
    if (formData.num_questions > maxQuestions) {
      alert(`Maximum ${maxQuestions} questions available for ${formData.category}`);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const result = await generateAIQuiz(formData);
      alert(`✅ ${result.message}\nQuiz ID: ${result.quiz_id}\nQuestions: ${result.num_questions}`);
      console.log('Generated Quiz:', result);
      
      // Navigate to the generated quiz attempt page
      navigate(`/student/quiz/generated?quiz_id=${result.quiz_id}`);
      
      // Reset form
      setFormData({
        ...formData,
        topic: '',
        num_questions: 10
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      alert('❌ Failed to generate quiz: ' + errorMsg);
      setError(errorMsg);
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-generator-form">
      <h2>🎯 Generate AI Quiz</h2>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Company Selection */}
        <div className="form-group">
          <label>Company *</label>
          <select 
            value={formData.company} 
            onChange={handleCompanyChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.company_name} value={company.company_name}>
                {company.company_name} - {company.track}
              </option>
            ))}
          </select>
        </div>

        {/* Track (auto-filled) */}
        {formData.track && (
          <div className="form-group">
            <label>Track</label>
            <input 
              type="text" 
              value={formData.track} 
              disabled 
              className="disabled-input"
            />
          </div>
        )}

        {/* Exam Type Selection */}
        {examTypes.length > 0 && (
          <div className="form-group">
            <label>Exam Type *</label>
            <select 
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Exam Type</option>
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Selection */}
        {categories.length > 0 && (
          <div className="form-group">
            <label>Category *</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Topic Input */}
        {formData.category && (
          <div className="form-group">
            <label>Topic *</label>
            <input 
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g., Binary Search, Sorting Algorithms"
              required
            />
            {topics.length > 0 && (
              <div className="topic-suggestions">
                <small>Existing topics: </small>
                {topics.map(t => (
                  <span 
                    key={t.topic} 
                    className="topic-tag"
                    onClick={() => setFormData({ ...formData, topic: t.topic })}
                  >
                    {t.topic} ({t.question_count || t.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Difficulty */}
        {formData.category && (
          <div className="form-group">
            <label>Difficulty *</label>
            <select 
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        )}

        {/* Number of Questions */}
        {formData.category && (
          <div className="form-group">
            <label>Number of Questions *</label>
            <input 
              type="number"
              name="num_questions"
              value={formData.num_questions}
              onChange={handleChange}
              min="1"
              max={getMaxQuestions()}
              required
            />
            <small className="help-text">
              Maximum available: {getMaxQuestions()} questions
            </small>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-generate"
            disabled={loading || !formData.topic}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Quiz'}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="form-info">
        <h4>ℹ️ How it works:</h4>
        <ul>
          <li>Select company and exam type from dropdowns</li>
          <li>Choose category (shows max available questions)</li>
          <li>Enter topic name (suggestions shown if available)</li>
          <li>System reuses DB questions if available</li>
          <li>AI generates only when needed</li>
        </ul>
      </div>
    </div>
  );
};

export default QuizGeneratorForm;
