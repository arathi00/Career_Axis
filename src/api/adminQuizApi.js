import axiosInstance from "./axiosInstance";


// -----------------------------
// GET ALL QUIZZES
// -----------------------------
export const getQuizzes = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/admin/quizzes");
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};


// -----------------------------
// CREATE QUIZ
// -----------------------------
export const createQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.post("/admin/quizzes", quizData);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};


// -----------------------------
// ADD QUESTION
// -----------------------------
export const addQuestion = async (questionData) => {
  try {
    const response = await axiosInstance.post("/admin/questions", questionData);
    return response.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};


// -----------------------------
// GET QUESTIONS OF A QUIZ
// -----------------------------
export const getQuizQuestions = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/admin/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};


// -----------------------------
// DISABLE QUIZ
// -----------------------------
export const disableQuiz = async (quizId) => {
  try {
    const response = await axiosInstance.put(`/admin/quizzes/${quizId}/disable`);
    return response.data;
  } catch (error) {
    console.error("Error disabling quiz:", error);
    throw error;
  }
};


// -----------------------------
// DELETE QUIZ
// -----------------------------
export const deleteQuiz = async (quizId) => {
  try {
    const response = await axiosInstance.delete(`/admin/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};


export const generateAIQuestions = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/generate-questions", data);
    return response.data;
  } catch (error) {
    console.error("Error generating AI questions:", error);
    throw error;
  }
};

// APPROVE QUESTION
export const approveQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.put(`/admin/questions/${questionId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving question:", error);
    throw error;
  }
};

// REJECT QUESTION
export const rejectQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.put(`/admin/questions/${questionId}/reject`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting question:", error);
    throw error;
  }
};

