import axios from './axiosConfig';

export const getUserMe = async () => {
  try {
    const res = await axios.get('/users/me');
    return res.data;
  } catch (err) {
    console.error('getUserMe failed:', err);
    throw err;
  }
};

export const getPrimaryDetails = async () => {
  try {
    const res = await axios.get('/resume/primary-details');
    return res.data;
  } catch (err) {
    console.error('getPrimaryDetails failed:', err);
    throw err;
  }
};

export const saveResume = async (data) => {
  try {
    const res = await axios.post('/resume/', data);
    return res.data;
  } catch (err) {
    console.error('saveResume failed:', err);
    throw err;
  }
};

export const getResume = async () => {
  try {
    const res = await axios.get('/resume/');
    return res.data;
  } catch (err) {
    console.error('getResume failed:', err);
    throw err;
  }
};
