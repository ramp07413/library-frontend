import api from './api';

export const expenseService = {
  getAll: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/expenses/stats');
    return response.data;
  },

  create: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  update: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};
