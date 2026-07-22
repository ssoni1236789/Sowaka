import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Standardize response extraction if the backend uses the new { success, data, message } format
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        return { ...response, data: response.data.data };
      } else {
        return Promise.reject(new Error(response.data.message));
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
