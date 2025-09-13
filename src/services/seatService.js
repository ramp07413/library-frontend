import api from './api';

export const seatService = {
  getAll: async () => {
    const response = await api.get('/seats');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/seats/stats');
    return response.data;
  },

  create: async (seatData) => {
    const response = await api.post('/seats/create', seatData);
    return response.data;
  },

  delete: async (seatData) => {
    const response = await api.delete('/seats/delete', { data: seatData });
    return response.data;
  },

  initialize: async (seatData) => {
    const response = await api.post('/seats/initialize', seatData);
    return response.data;
  },

  assignSeat: async (seatData) => {
    const response = await api.post('/seats/assign', seatData);
    return response.data;
  },

  unassignSeat: async (seatId, studentId) => {
    const response = await api.put(`/seats/${seatId}/unassign`, { studentId });
    return response.data;
  },

  // Legacy method for backward compatibility
  releaseSeat: async (seatId) => {
    return await seatService.unassignSeat(seatId);
  },
};
