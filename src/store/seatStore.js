import { create } from 'zustand';
import { seatService } from '../services/seatService';
import toast from 'react-hot-toast';

export const useSeatStore = create((set, get) => ({
  seats: [],
  isLoading: false,

  fetchSeats: async () => {
    set({ isLoading: true });
    try {
      const response = await seatService.getAll();
      set({ seats: response.seats || response, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getStats: async () => {
    try {
      const response = await seatService.getStats();
      return response;
    } catch (error) {
      console.error('Failed to get seat stats:', error);
      return { stats: { total: 0, occupied: 0, available: 0 } };
    }
  },

  createSeat: async (seatData) => {
    try {
      const response = await seatService.create(seatData);
      toast.success('Seat created successfully!');
      get().fetchSeats();
      return { success: true };
    } catch (error) {
      toast.error('Failed to create seat');
      return { success: false };
    }
  },

  deleteSeat: async (seatData) => {
    try {
      const response = await seatService.delete(seatData);
      toast.success('Seat deleted successfully!');
      get().fetchSeats();
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete seat');
      return { success: false };
    }
  },

  assignSeat: async (seatData) => {
    try {
      const response = await seatService.assignSeat(seatData);
      const updatedSeat = response.seat || response;
      set({
        seats: get().seats.map(s => s._id === seatData.seatId ? updatedSeat : s)
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to assign seat:', error);
      return { success: false };
    }
  },

  unassignSeat: async (seatId) => {
    try {
      const response = await seatService.unassignSeat(seatId);
      const updatedSeat = response.seat || response;
      set({
        seats: get().seats.map(s => s._id === seatId ? updatedSeat : s)
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to unassign seat:', error);
      return { success: false };
    }
  },

  initializeSeats: async (seatData) => {
    try {
      const response = await seatService.initialize(seatData);
      toast.success('Seats initialized successfully!');
      get().fetchSeats();
      return { success: true };
    } catch (error) {
      toast.error('Failed to initialize seats');
      return { success: false };
    }
  },

  // Legacy method for backward compatibility
  releaseSeat: async (seatId) => {
    return await get().unassignSeat(seatId);
  },
}));
