import api from './api';

export const alertService = {
  getAll: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/alerts/stats');
    return response.data;
  },

  create: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/alerts/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/alerts/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};
