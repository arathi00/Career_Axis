import axiosInstance from './axiosConfig';

export const loginUser = (data) => axiosInstance.post('/auth/login', data);
export const registerUser = (data) => axiosInstance.post('/auth/register', data);
