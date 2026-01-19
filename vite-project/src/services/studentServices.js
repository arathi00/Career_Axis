// src/services/studentServices.js - CORRECTED VERSION
import axios from 'axios';

// Base URL - matches your backend
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION SERVICES ==========

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Save token if returned
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    } else if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    // Save user data if returned
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  window.location.href = '/login';
};

// Check if user is authenticated
export const checkAuth = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ========== RESUME SERVICES ==========

// Get student registration details (from /resume/primary-details endpoint)
export const getStudentRegistrationDetails = async () => {
  try {
    const response = await api.get('/resume/primary-details');
    return response.data;
  } catch (error) {
    console.error('Error fetching student registration details:', error);
    
    // If 404, it means student hasn't completed registration yet
    if (error.response?.status === 404) {
      throw new Error('Student data not found. Please complete registration first.');
    }
    
    throw error;
  }
};

// Get saved resume data (from /resume/ endpoint)
export const getSavedResumeData = async () => {
  try {
    const response = await api.get('/resume/');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved resume data:', error);
    
    // If 404, no resume exists yet (this is normal for new users)
    if (error.response?.status === 404) {
      return null; // Return null instead of throwing
    }
    
    throw error;
  }
};

// Save or update resume data (to /resume/ endpoint)
export const saveResumeData = async (resumeData) => {
  try {
    // Try different payload formats
    let response;
    
    try {
      // First try: Send data directly
      response = await api.post('/resume/', resumeData);
    } catch (firstError) {
      if (firstError.response?.status === 422) {
        // If validation error, try wrapped format
        response = await api.post('/resume/', { resume: resumeData });
      } else {
        throw firstError;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error saving resume data:', error);
    throw error;
  }
};

// Update resume data (same as save - POST handles both)
export const updateResumeData = async (resumeData) => {
  return saveResumeData(resumeData);
};

// Delete resume data
export const deleteResumeData = async () => {
  try {
    const response = await api.delete('/resume/');
    return response.data;
  } catch (error) {
    console.error('Error deleting resume data:', error);
    throw error;
  }
};

// ========== UTILITY FUNCTIONS ==========

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    return {
      connected: true,
      status: response.status,
      message: 'Backend is running'
    };
  } catch (error) {
    return {
      connected: false,
      status: error.response?.status || 0,
      message: 'Cannot connect to backend server'
    };
  }
};

// Get API base URL (export if needed elsewhere)
export const API_URL = API_BASE_URL;

// ========== EXPORT ALL SERVICES ==========
export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getCurrentUser,
  
  // Resume
  getStudentRegistrationDetails,
  getSavedResumeData,
  saveResumeData,
  updateResumeData,
  deleteResumeData,
  
  // Utility
  testBackendConnection,
  API_URL
};