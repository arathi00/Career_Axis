import axiosInstance from './axiosConfig';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/register`, payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get(`${API_BASE_URL}/me`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  sessionStorage.clear();
};

export default { loginUser, registerUser, getProfile, logout };
