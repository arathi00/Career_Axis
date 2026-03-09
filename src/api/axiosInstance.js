import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("Token being sent:", token); // Debugging token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request headers:", config.headers); // Debugging headers
  return config;
});

export default axiosInstance;
