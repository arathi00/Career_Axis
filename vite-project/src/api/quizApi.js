import axiosInstance from "./axiosInstance";

export const fetchQuizzes = async () => {
  const res = await axiosInstance.get(`/quizzes/`);
  return res.data;
};

export const fetchQuizById = async (id) => {
  const res = await axiosInstance.get(`/quizzes/${id}`);
  return res.data;
};
