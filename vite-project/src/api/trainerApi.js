import axios from "./axiosConfig";

export const getTrainerStats = () => axios.get("/trainer/stats");
export const getStudents = () => axios.get("/trainer/students");
export const getModules = () => axios.get("/trainer/modules");
export const getAssessments = () => axios.get("/trainer/assessments");

export const scheduleSession = (data) => axios.post("/trainer/schedule", data);
export const sendAnnouncement = (data) => axios.post("/trainer/announcement", data);
