import api from "./axiosConfig";

/* =====================
   TRAINER APIs
===================== */

// Create interview slot (trainer)
export const createInterviewSlot = (payload) =>
  api.post("/interviews/trainer/create", payload)
     .then(res => res.data);

// Get trainer's own slots
export const getTrainerSlots = () =>
  api.get("/interviews/trainer/my-interviews").then(res => res.data);


// Get trainer notifications
export const getTrainerNotifications = () =>
   api.get("/interviews/trainer/notifications")
       .then(res => res.data);

// Submit feedback
export const submitFeedback = (id, feedback) =>
  api.post(`/interviews/trainer/feedback/${id}`, feedback)
     .then(res => res.data);

export const getAssignedStudents = () =>
  api.get("/interviews/trainer/assigned-students")
     .then(res => res.data);

export const getPastInterviews = () =>
  api.get("/interviews/trainer/past-interviews")
     .then(res => res.data);

// Mark interview as completed
export const completeInterview = (id) =>
  api.post(`/interviews/trainer/complete/${id}`)
     .then(res => res.data);

/* =====================
   STUDENT APIs
===================== */

// Get available slots
export const getAvailableSlots = () =>
  api.get("/interviews/student/available")
     .then(res => res.data);


// Book slot
export const bookSlot = (id) =>
  api.post(`/interviews/student/book/${id}`)
     .then(res => res.data);

// Get student's booked interviews
export const getMyInterviews = () =>
  api.get("/interviews/student/my-interviews")
     .then(res => res.data);



  
     