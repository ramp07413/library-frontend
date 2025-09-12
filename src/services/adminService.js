import api from './api';

export const adminService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/admin/users', adminData);
    return response.data;
  },

  updatePermissions: async (id, permissions) => {
    const response = await api.put(`/admin/users/${id}/permissions`, permissions);
    return response.data;
  },

  toggleUserStatus: async (id, statusData) => {
    const response = await api.put(`/admin/users/${id}/status`, statusData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
};
