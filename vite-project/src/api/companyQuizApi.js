import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Get list of available companies
export const getCompanies = async () => {
  const response = await axios.get(`${API_BASE_URL}/company-quiz/companies`);
  return response.data;
};

// Get exam types for a company (mock data - adapt to your backend)
export const getExamTypes = async (company) => {
  // Return static options for now
  return ['Aptitude', 'Technical', 'Verbal', 'Logical'];
};

// Get categories for company and exam type (mock data)
export const getCompanyCategories = async (company, examType) => {
  // Return static categories based on exam type
  if (examType === 'Technical') {
    return ['Programming', 'Database', 'Networking', 'Operating Systems'];
  } else if (examType === 'Aptitude') {
    return ['Quantitative', 'Logical Reasoning', 'Data Interpretation'];
  }
  return ['General'];
};

// Get topics for company, track, exam type, and category (mock data)
export const getTopics = async (company, track, examType, category) => {
  // Return static topics based on category
  const topicMap = {
    'Programming': ['Arrays', 'Strings', 'Algorithms', 'Data Structures'],
    'Database': ['SQL', 'Normalization', 'Transactions', 'Indexing'],
    'Quantitative': ['Arithmetic', 'Algebra', 'Geometry', 'Probability'],
    'Logical Reasoning': ['Puzzles', 'Sequences', 'Patterns', 'Analogies']
  };
  return topicMap[category] || ['General Topics'];
};

// Generate AI quiz (using the backend startQuiz endpoint)
export const generateAIQuiz = async (quizData) => {
  // Map the quizData to backend's expected format
  return await startQuiz(
    quizData.company,
    quizData.difficulty || 'Medium',
    quizData.num_questions || 10,
    quizData.exam_type || 'Aptitude'
  );
};

// Start a new quiz
export const startQuiz = async (company, level, questionCount, quizType = 'Aptitude') => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    `${API_BASE_URL}/company-quiz/start`,
    {
      company,
      level,
      questionCount,
      quizType,
      userId: user.id
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Submit quiz answers
export const submitQuiz = async (quizId, answers) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  const response = await axios.post(
    `${API_BASE_URL}/company-quiz/submit`,
    {
      quizId,
      userId: user.id,
      answers
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

// Get quiz results
export const getQuizResults = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_BASE_URL}/company-quiz/results/${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};
