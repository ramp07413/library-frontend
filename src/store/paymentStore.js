import { create } from 'zustand';
import { paymentService } from '../services/paymentService';
import { alertService } from '../services/alertService';
import toast from 'react-hot-toast';

export const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,

  fetchPayments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await paymentService.getAll(params);
      set({ payments: data.payments || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false, payments: [] });
      toast.error('Failed to fetch payments');
    }
  },

  addPendingPayment: async (paymentData) => {
    set({ loading: true });
    try {
      const response = await paymentService.addPendingPayment(paymentData);
      const newPayment = response.paymentData;
      
      // Fetch updated payments to get populated student data
      await get().fetchPayments();
      
      // Create alert for pending payment
      try {
        await alertService.create({
          title: 'New Pending Payment',
          message: `Pending payment of ₹${paymentData.amount} added for ${paymentData.month} ${paymentData.year}`,
          type: 'info',
          priority: 'medium'
        });
      } catch (alertError) {
        console.error('Failed to create alert:', alertError);
      }
      
      toast.success('Pending payment added successfully');
      return response;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to add pending payment');
      throw error;
    }
  },

  depositPayment: async (paymentData) => {
    set({ loading: true });
    try {
      const response = await paymentService.depositPayment(paymentData);
      
      // Fetch updated payments to get populated student data
      await get().fetchPayments();
      
      // Create alert for payment deposit
      try {
        await alertService.create({
          title: 'Payment Deposited',
          message: `Payment of ₹${paymentData.amount} deposited via ${paymentData.paymentType} for ${paymentData.month} ${paymentData.year}`,
          type: 'success',
          priority: 'medium'
        });
      } catch (alertError) {
        console.error('Failed to create alert:', alertError);
      }
      
      toast.success('Payment deposited successfully');
      return response;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Failed to deposit payment');
      throw error;
    }
  },

  getStudentPayment: async (studentId) => {
    try {
      const data = await paymentService.getOneStudentPayment(studentId);
      return data;
    } catch (error) {
      toast.error('Failed to fetch student payment');
      throw error;
    }
  },

  updatePayment: async (id, paymentData) => {
    set({ loading: true });
    try {
      const response = await paymentService.updatePayment(id, paymentData);
      
      // Fetch updated payments to get populated student data
      await get().fetchPayments();
      
      // Create alert for payment update
      try {
        await alertService.create({
          title: 'Payment Updated',
          message: `Payment status updated to ${paymentData.status || 'modified'}`,
          type: 'info',
          priority: 'low'
        });
      } catch (alertError) {
        console.error('Failed to create alert:', alertError);
      }
      
      toast.success('Payment updated successfully');
      return response;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to update payment');
      throw error;
    }
  },

  deletePayment: async (id) => {
    set({ loading: true });
    try {
      await paymentService.deletePayment(id);
      set(state => ({
        payments: state.payments.filter(p => p._id !== id),
        loading: false
      }));
      
      // Create alert for payment deletion
      try {
        await alertService.create({
          title: 'Payment Deleted',
          message: 'Payment record has been deleted',
          type: 'warning',
          priority: 'low'
        });
      } catch (alertError) {
        console.error('Failed to create alert:', alertError);
      }
      
      toast.success('Payment deleted successfully');
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to delete payment');
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
