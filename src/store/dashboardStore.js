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
  studentShiftDistribution: null,
  isLoading: false,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const response = await dashboardService.getStats();
      set({ stats: response.stats || response, isLoading: false });
      get().fetchStudentShiftDistribution();
    } catch {
      set({ isLoading: false });
    }
  },

  fetchStudentShiftDistribution: async () => {
    try {
      const response = await dashboardService.getStudentShiftDistribution();
      const students = response.students || response;
      const shiftCounts = students.reduce((acc, student) => {
        const shift = student.shift || 'Unknown';
        acc[shift] = (acc[shift] || 0) + 1;
        return acc;
      }, {});

      const distribution = Object.keys(shiftCounts).map(shift => ({
        shift,
        count: shiftCounts[shift]
      }));

      set({ studentShiftDistribution: distribution });
    } catch (error) {
      console.error('Failed to fetch student shift distribution:', error);
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
