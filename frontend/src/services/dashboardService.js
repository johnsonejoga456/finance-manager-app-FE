import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/dashboard`;

// Create reusable axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach token and debug requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[dashboard API] Attached Authorization header.');
  } else {
    console.warn('[dashboard API] No token found in localStorage.');
  }
  console.log('[dashboard API] Request:', config);
  return config;
});

// Global 401 handling
API.interceptors.response.use(
  (response) => {
    console.log('[dashboard API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[dashboard API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('[dashboard API] Unauthorized. Clearing token and redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getDashboardSummary = async () => {
  try {
    console.log('[dashboard API] Fetching dashboard summary...');
    const response = await API.get('/summary');
    console.log('[dashboard API] Dashboard summary fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('[dashboard API] Error fetching dashboard summary:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard summary');
  }
};
