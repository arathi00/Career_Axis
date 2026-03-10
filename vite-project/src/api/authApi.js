import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Registration failed" };
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);

    // Save token locally (important)
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Login failed" };
  }
};

export default API;
