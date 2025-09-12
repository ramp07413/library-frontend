import { create } from 'zustand';
import { adminService } from '../services';
import toast from 'react-hot-toast';

export const useAdminStore = create((set, get) => ({
  users: [],
  userStats: null,
  isLoading: false,

  fetchUsers: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await adminService.getUsers(params);
      set({ users: response.users || response, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUserStats: async () => {
    try {
      const response = await adminService.getUserStats();
      set({ userStats: response.stats || response });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  },

  createAdmin: async (adminData) => {
    try {
      const response = await adminService.createAdmin(adminData);
      set({ users: [...get().users, response.user || response] });
      toast.success('Admin created successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  updatePermissions: async (id, permissions) => {
    try {
      const response = await adminService.updatePermissions(id, permissions);
      set({
        users: get().users.map(u => u._id === id ? (response.user || response) : u)
      });
      toast.success('Permissions updated successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  toggleUserStatus: async (id, statusData) => {
    try {
      const response = await adminService.toggleUserStatus(id, statusData);
      set({
        users: get().users.map(u => u._id === id ? (response.user || response) : u)
      });
      toast.success('User status updated successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  deleteUser: async (id) => {
    try {
      await adminService.deleteUser(id);
      set({ users: get().users.filter(u => u._id !== id) });
      toast.success('User deleted successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
