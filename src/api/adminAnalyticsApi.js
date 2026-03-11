import axios from "./axiosInstance";

export const getOverview = () =>
  axios.get("/admin/analytics/overview");

export const getPerformance = () =>
  axios.get("/admin/analytics/performance");

export const getActivity = () =>
  axios.get("/admin/analytics/activity");