// src/api/interviewApi.js
import api from "./axiosConfig"; // your configured axios instance

const interviewApi = {
  // fetch available slots (public slots or trainer-created open slots)
  getSlots: () => api.get("/interview/slots").then(res => res.data),

  // student books a slot
  bookSlot: (slotId) => api.post("/interview/schedule", { slotId }).then(res => res.data),

  // get upcoming & past interviews for a student
  getStudentInterviews: (studentId) => api.get(`/interview/student/${studentId}`).then(res => res.data),

  // get interviews for trainer
  getTrainerInterviews: (trainerId) => api.get(`/interview/trainer/${trainerId}`).then(res => res.data),

  // create a slot (trainer)
  createSlot: (payload) => api.post("/interview/slots", payload).then(res => res.data),

  // get join link / session token for an interview
  getJoinLink: (interviewId) => api.get(`/interview/join/${interviewId}`).then(res => res.data),

  // submit feedback (trainer)
  submitFeedback: (interviewId, feedbackPayload) =>
    api.post(`/interview/feedback`, { interviewId, ...feedbackPayload }).then(res => res.data),

  // fetch a single interview by id
  getInterview: (interviewId) => api.get(`/interview/${interviewId}`).then(res => res.data),
};

export default interviewApi;
