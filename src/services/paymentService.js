import api from './api';

export const paymentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },

  exportPayments: async (params = {}) => {
    const response = await api.get('/payments/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  update: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  // Legacy method for backward compatibility
  updateStatus: async (id, statusData) => {
    return await paymentService.update(id, statusData);
  },
};
