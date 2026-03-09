import axiosInstance from './axiosConfig';

const API_BASE_URL = 'http://localhost:8000/api';

const interviewApi = {
  // Get all available interview slots
  getSlots: async () => {
    const response = await axiosInstance.get('/interviews/slots');
    return response.data;
  },

  // Get specific interview details
  getInterview: async (interviewId) => {
    const response = await axiosInstance.get(`/interviews/${interviewId}`);
    return response.data;
  },

  // Book an interview slot (student)
  bookSlot: async (slotId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await axiosInstance.post(
      `/interviews/slots/${slotId}/book`,
      { studentId: user.id }
    );
    return response.data;
  },

  // Get student's booked interviews
  getStudentInterviews: async (studentId) => {
    const response = await axiosInstance.get(`/interviews/student/${studentId}`);
    return response.data;
  },

  // Get trainer's interviews
  getTrainerInterviews: async (trainerId) => {
    const response = await axiosInstance.get(`/interviews/trainer/${trainerId}`);
    return response.data;
  },

  // Create new interview slot (trainer)
  createSlot: async (slotData) => {
    const response = await axiosInstance.post('/interviews/slots', slotData);
    return response.data;
  },

  // Submit feedback for interview (trainer)
  submitFeedback: async (interviewId, feedbackData) => {
    const response = await axiosInstance.put(`/interviews/${interviewId}/feedback`, feedbackData);
    return response.data;
  }
};

export default interviewApi;
