import { create } from 'zustand';
import { studentService } from '../services';
import toast from 'react-hot-toast';

export const useStudentStore = create((set, get) => ({
  students: [],
  isLoading: false,
  filters: { search: '', shift: 'all', status: 'all', seatingType : 'all' },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchStudents();
  },

  fetchStudents: async () => {
    set({ isLoading: true });
    try {
      const response = await studentService.getAll(get().filters);
      set({ students: response.students || response, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await studentService.getById(id);
      return { success: true, student: response.student || response };
    } catch {
      return { success: false };
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await studentService.create(studentData);
      set({ students: [...get().students, response.student || response] });
      toast.success('Student created successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  updateStudent: async (id, studentData) => {
    try {
      const response = await studentService.update(id, studentData);
      set({
        students: get().students.map(s => s._id === id ? (response.student || response) : s)
      });
      toast.success('Student updated successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  deleteStudent: async (id) => {
    try {
      await studentService.delete(id);
      set({ students: get().students.filter(s => s._id !== id) });
      toast.success('Student deleted successfully!');
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
