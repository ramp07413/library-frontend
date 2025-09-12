import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRevenueAnalytics: async () => {
    const response = await api.get('/dashboard/revenue-analytics');
    return response.data;
  }
};
