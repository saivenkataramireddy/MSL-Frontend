import axios from 'axios';

const api = axios.create({
  baseURL: 'https://msl-backend-6uej.onrender.com/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('msl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('msl_token');
      localStorage.removeItem('msl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
