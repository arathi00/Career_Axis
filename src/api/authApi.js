import axios from "axios";

// 🔐 AUTH API (NO TOKEN EVER)
const authAPI = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// REGISTER
export const registerUser = async (data) => {
  const res = await authAPI.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  localStorage.clear();
  sessionStorage.clear();

  const res = await authAPI.post("/auth/login", data);

  // ✅ keep same key everywhere
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("role", res.data.role);

  return res.data;
};

export default authAPI;