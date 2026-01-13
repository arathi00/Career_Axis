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
  // 🔥 IMPORTANT: clear old auth before login
  localStorage.clear();
  sessionStorage.clear();

  const res = await authAPI.post("/auth/login", data);

  localStorage.setItem("token", res.data.access_token);
  // optional: only if backend sends user
  // localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

export default authAPI;
