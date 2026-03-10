import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach token if present on every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// log errors for debugging
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Axios error:', err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);


export default axiosInstance;
