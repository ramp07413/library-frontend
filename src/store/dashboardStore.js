import { create } from 'zustand';
import { dashboardService } from '../services';

export const useDashboardStore = create((set) => ({
  stats: {
    totalStudents: 0,
    activeStudents: 0,
    totalSeats: 0,
    occupiedSeats: 0,
    availableSeats: 0,
    fullseat: 0,
    halfseat: 0,
    monthlyRevenue: 0,
  },
  revenueAnalytics: null,
  isLoading: false,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const response = await dashboardService.getStats();
      set({ stats: response.stats || response, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchRevenueAnalytics: async () => {
    try {
      const response = await dashboardService.getRevenueAnalytics();
      set({ revenueAnalytics: response.analytics || response });
    } catch (error) {
      console.error('Failed to fetch revenue analytics:', error);
    }
  },
}));
