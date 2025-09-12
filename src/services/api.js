import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  console.log('API Request - Token:', token);
  console.log('API Request - URL:', config.url);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Authorization header set');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response - Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response - Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('401 error - removing token and reloading');
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
    toast.error(error.response?.data?.message || 'Something went wrong');
    return Promise.reject(error);
  }
);

export default api;
