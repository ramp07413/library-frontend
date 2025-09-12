import api from './api';

export const userService = {
  getDashboard: async () => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  getDetails: async () => {
    const response = await api.get('/user/details');
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/user/payments');
    return response.data;
  },

  getDuePayments: async () => {
    const response = await api.get('/user/due-payments');
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/user/alerts');
    return response.data;
  },

  getSeat: async () => {
    const response = await api.get('/user/seat');
    return response.data;
  }
};
