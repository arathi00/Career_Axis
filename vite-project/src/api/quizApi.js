import axiosInstance from './axiosConfig';

const API_BASE_URL = 'http://localhost:8000/api';

// Fetch all quizzes
export const fetchQuizzes = async (filters = {}) => {
  const response = await axiosInstance.get('/quizzes', {
    params: filters
  });
  return response.data;
};

// Fetch quiz by ID
export const fetchQuizById = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data;
};

// Submit quiz answers
export const submitQuizAnswers = async (quizId, answers, startedAt = null, totalTimeSec = null) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const payload = {
    userId: user.id,
    answers
  };

  if (startedAt) payload.started_at = startedAt;
  if (totalTimeSec !== null) payload.total_time_sec = totalTimeSec;

  const response = await axiosInstance.post(
    `/quizzes/${quizId}/submit`,
    payload
  );
  return response.data;
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  const response = await axiosInstance.post('/quizzes', quizData);
  return response.data;
};

// Update quiz
export const updateQuiz = async (quizId, quizData) => {
  const response = await axiosInstance.put(`/quizzes/${quizId}`, quizData);
  return response.data;
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(`/quizzes/${quizId}`);
  return response.data;
};

// Get user's quiz results
export const getUserQuizResults = async (userId) => {
  const response = await axiosInstance.get(`/quizzes/results/user/${userId}`);
  return response.data;
};

// ------------------ Additional helpers used across app ------------------
// Generate a quiz from question bank (company/exam specific)
export const generateBankQuiz = async (options = {}) => {
  const response = await axiosInstance.post('/quiz-generator/bank', options);
  return response.data;
};

// Generate a simple/custom quiz (client-driven)
export const generateSimpleQuiz = async (options = {}) => {
  const response = await axiosInstance.post('/quiz-generator/simple', options);
  return response.data;
};

// Fetch a generated quiz by id
export const getGeneratedQuiz = async (generatedQuizId) => {
  const response = await axiosInstance.get(`/quiz-generator/${generatedQuizId}`);
  return response.data;
};

// Company stats - Get all available companies
export const getCompanyStats = async () => {
  try {
    // Use company-quiz endpoint which queries the database directly
    const response = await axiosInstance.get('/company-quiz/companies');
    
    // Transform database response to match frontend expectations
    if (Array.isArray(response.data)) {
      return response.data.map(company => ({
        name: company.name,
        description: company.description || '',
        tags: ['Aptitude', 'Technical', 'Verbal'],  // Default tags
        overview: company.description || 'Interview preparation for this company',
        totalQuestions: 0  // Will be fetched separately if needed
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Get available quizzes for a company/type
export const getAvailableQuizzes = async (companyName, type) => {
  const response = await axiosInstance.get('/quizzes/available', {
    params: { company: companyName, type }
  });
  return response.data;
};

// Get question bank statistics
export const getQuestionBankStats = async () => {
  const response = await axiosInstance.get('/quizzes/stats');
  return response.data;
};