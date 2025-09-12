import { create } from 'zustand';
import { expenseService } from '../services/expenseService';
import toast from 'react-hot-toast';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const expenses = await expenseService.getAll();
      set({ expenses, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createExpense: async (expenseData) => {
    try {
      const newExpense = await expenseService.create(expenseData);
      set({ expenses: [...get().expenses, newExpense] });
      toast.success('Expense added successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const updatedExpense = await expenseService.update(id, expenseData);
      set({
        expenses: get().expenses.map(e => e._id === id ? updatedExpense : e)
      });
      toast.success('Expense updated successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  deleteExpense: async (id) => {
    try {
      await expenseService.delete(id);
      set({ expenses: get().expenses.filter(e => e._id !== id) });
      toast.success('Expense deleted successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
