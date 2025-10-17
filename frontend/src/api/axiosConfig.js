import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
   
    if (error.response && error.response.status === 401) {
      console.log('Sesión expirada. Redirigiendo al login...');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error); 
  }
);

export default api;