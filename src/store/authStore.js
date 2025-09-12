import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          const { token, user } = response;
          
          console.log('Login response:', { token, user });
          localStorage.setItem('auth_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { success: false };
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        const currentState = get();
        
        console.log('CheckAuth - Token from localStorage:', token);
        console.log('CheckAuth - Current state:', currentState);
        
        if (!token) {
          console.log('No token found, logging out');
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }

        // If we have both token and user in state, we're authenticated
        if (token && currentState.user && currentState.isAuthenticated) {
          console.log('Already authenticated with stored data');
          return;
        }

        try {
          console.log('Fetching profile with token:', token);
          const response = await authService.getProfile();
          console.log('Profile response:', response);
          
          set({ 
            user: response.user, 
            token, 
            isAuthenticated: true 
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        }
      },

      hasPermission: (module, action) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'super_admin') return true;
        return user.permissions?.[module]?.[action] || false;
      },
    }),
    { 
      name: 'auth-storage'
    }
  )
);
