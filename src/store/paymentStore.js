import { create } from 'zustand';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set, get) => ({
  payments: [],
  stats: {
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    overduePayments: 0,
  },
  isLoading: false,
  filters: { search: '', status: 'all' },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchPayments();
  },

  fetchPayments: async () => {
    set({ isLoading: true });
    try {
      const payments = await paymentService.getAll(get().filters);
      set({ payments, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchPaymentStats: async () => {
    try {
      const stats = await paymentService.getStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch payment stats:', error);
    }
  },

  updatePaymentStatus: async (id, statusData) => {
    try {
      const updatedPayment = await paymentService.updateStatus(id, statusData);
      set({
        payments: get().payments.map(p => p._id === id ? updatedPayment : p)
      });
      toast.success('Payment status updated successfully!');
      get().fetchPaymentStats();
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
