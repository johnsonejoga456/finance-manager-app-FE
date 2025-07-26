import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: `${BASE_URL}/auth`,
});

// Attach token if available
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
