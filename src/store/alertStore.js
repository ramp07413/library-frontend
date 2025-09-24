import { create } from 'zustand';
import { alertService } from '../services/alertService';
import toast from 'react-hot-toast';

export const useAlertStore = create((set, get) => ({
  alerts: [],
  isLoading: false,


  fetchAlerts: async () => {
    set({ isLoading: true });
    try {
      const alerts = await alertService.getAll();
      set({ alerts, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await alertService.markAsRead(id);
      set({
        alerts: get().alerts.map(a => a._id === id ? {...a, isRead: true} : a)
        });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  markAllAsRead: async () => {
    try {
      await alertService.markAllAsRead();
      set({
        alerts: get().alerts.map(a => ({...a, read: true}))
      });
      // const updateAll=get().alerts.map((alert)=>alert.read=true)
      toast.success('All alerts marked as read');
      return { success: true };
    } catch {
      return { success: false };
    }
  },
    DeleteAlert:async (_id)=>{
      set({isLoading:true})
    try {
      await alertService.delete(_id)
        
          const updatealert = get().alerts.filter((alert)=>alert._id !== _id)

          set({alerts : updatealert,isLoading:false})
    } catch (error) {
      set({isLoading:true})
      console.log("jjh",error)
    }
    
  },
  
}));


