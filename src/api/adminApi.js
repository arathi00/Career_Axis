import axios from "./axiosInstance";

// helper to attach token
const authHeader = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// ============================
// GET PENDING TRAINERS
// ============================

export const getPendingTrainers = async () => {
  const res = await axios.get(
    "/admin/trainers/pending",
    authHeader()
  );

  return { data: res.data };
};

// ============================
// GET APPROVED TRAINERS
// ============================
// (since backend doesn't have separate API,
// we filter pending=false on frontend)

export const getApprovedTrainers = async () => {
  return await axios.get(
    "/admin/trainers/approved",
    authHeader()
  );
};

// ============================
// APPROVE TRAINER
// ============================

export const approveTrainer = async (id) => {
  const res = await axios.put(
    `/admin/trainers/${id}/approve`,
    {},
    authHeader()
  );

  return res.data;
};

// ============================
// REJECT TRAINER
// ============================

export const rejectTrainer = async (id) => {
  const res = await axios.put(
    `/admin/trainers/${id}/reject`,
    {},
    authHeader()
  );

  return res.data;
};

// ============================
// DISABLE TRAINER
// ============================

export const disableTrainer = async (id) => {
  const res = await axios.put(
    `/admin/trainers/${id}/disable`,
    {},
    authHeader()
  );

  return res.data;
};

// =============================
// GET ALL QUIZZES
// =============================
export const getQuizzes = async () => {
  const res = await axios.get(
    "/admin/quizzes",
    authHeader()
  );

  return res.data;
};

// =============================
// DELETE QUIZ
// =============================
export const deleteQuiz = async (quizId) => {
  const res = await axios.delete(
    `/admin/quizzes/${quizId}`,
    authHeader()
  );

  return res.data;
};

// =============================
// DISABLE QUIZ
// =============================
export const disableQuiz = async (quizId) => {
  const res = await axios.put(
    `/admin/quizzes/${quizId}/disable`,
    {},
    authHeader()
  );

  return res.data;
};