import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Intercept requests to attach a token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const login = (credentials) => API.post('/login', credentials);
export const registerUser = (userData) => API.post('/register', userData);
export const getUser = () => API.get('/me');
export const forgotPassword = (emailData) => API.post('/forgot-password', emailData);
