import { create } from 'zustand';
import { userService } from '../services';

export const useUserStore = create((set) => ({
  dashboard: null,
  details: null,
  payments: [],
  duePayments: [],
  alerts: [],
  seat: null,
  isLoading: false,

  fetchUserDashboard: async () => {
    set({ isLoading: true });
    try {
      const response = await userService.getDashboard();
      set({ dashboard: response.dashboard || response, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUserDetails: async () => {
    try {
      const response = await userService.getDetails();
      set({ details: response.details || response });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  },

  fetchUserPayments: async () => {
    try {
      const response = await userService.getPayments();
      set({ payments: response.payments || response });
    } catch (error) {
      console.error('Failed to fetch user payments:', error);
    }
  },

  fetchDuePayments: async () => {
    try {
      const response = await userService.getDuePayments();
      set({ duePayments: response.duePayments || response });
    } catch (error) {
      console.error('Failed to fetch due payments:', error);
    }
  },

  fetchUserAlerts: async () => {
    try {
      const response = await userService.getAlerts();
      set({ alerts: response.alerts || response });
    } catch (error) {
      console.error('Failed to fetch user alerts:', error);
    }
  },

  fetchUserSeat: async () => {
    try {
      const response = await userService.getSeat();
      set({ seat: response.seat || response });
    } catch (error) {
      console.error('Failed to fetch user seat:', error);
    }
  },
}));
