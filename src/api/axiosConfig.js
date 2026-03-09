import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.debug("[axios] request ->", config.method, config.url, {
    authorization: config.headers?.Authorization,
  });

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // log useful debug info for 401s / auth failures
    try {
      console.error("[axios] response error ->", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default axiosInstance;
