import api from './api';

export const paymentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  addPendingPayment: async (paymentData) => {
    const response = await api.post('/payments/addPending', paymentData);
    return response.data;
  },

  depositPayment: async (paymentData) => {
    const response = await api.put('/payments/depositPayment', paymentData);
    return response.data;
  },

  getOneStudentPayment: async (id) => {
    const response = await api.get(`/payments/get/${id}`);
    return response.data;
  },

  updatePayment: async (id, paymentData) => {
    const response = await api.patch(`/payments/update/${id}`, paymentData);
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/delete/${id}`);
    return response.data;
  }
};
