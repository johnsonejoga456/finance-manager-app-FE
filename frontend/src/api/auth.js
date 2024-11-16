import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Backend base URL from environment variables
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
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (data) => API.post('/auth/register', data);
export const getUser = () => API.get('/auth/me');
