import axios from "axios";

const protectedAPI = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

protectedAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default protectedAPI;
