import axios from "./axiosInstance";

export const generateAIQuestions = (data) => {
  return axios.post("/quiz/generate-ai", data);
};