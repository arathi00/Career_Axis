import axiosInstance from './axiosConfig';

const dashboardApi = {
  // Get student dashboard data
  getStudentDashboard: async () => {
    const response = await axiosInstance.get('/student/dashboard');
    return response.data;
  },

  // Get trainer dashboard data
  getTrainerDashboard: async () => {
    const response = await axiosInstance.get('/trainer/dashboard');
    return response.data;
  },

  // Get admin dashboard data
  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  }
};

export default dashboardApi;
