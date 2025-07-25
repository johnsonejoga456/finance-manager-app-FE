import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/debts`;

// Create reusable axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token and debug requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[debt API] Attached Authorization header.');
  } else {
    console.warn('[debt API] No token found in localStorage.');
  }
  console.log('[debt API] Request:', config);
  return config;
});

// Global 401 handling with redirect
API.interceptors.response.use(
  (response) => {
    console.log('[debt API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[debt API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('[debt API] Unauthorized. Clearing token and redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const debtService = {
  getDebts: async () => {
    try {
      console.log('[debt API] Fetching all debts...');
      const response = await API.get('/');
      console.log('[debt API] Fetched debts:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error fetching debts:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch debts');
    }
  },

  getDebtById: async (id) => {
    try {
      console.log(`[debt API] Fetching debt with ID: ${id}`);
      const response = await API.get(`/${id}`);
      console.log('[debt API] Fetched debt:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error fetching debt by ID:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch debt');
    }
  },

  createDebt: async (debt) => {
    try {
      console.log('[debt API] Creating debt:', debt);
      const response = await API.post('/', debt);
      console.log('[debt API] Created debt:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error creating debt:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create debt');
    }
  },

  updateDebt: async (id, debt) => {
    try {
      console.log(`[debt API] Updating debt ${id}:`, debt);
      const response = await API.put(`/${id}`, debt);
      console.log('[debt API] Updated debt:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error updating debt:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update debt');
    }
  },

  deleteDebt: async (id) => {
    try {
      console.log(`[debt API] Deleting debt with ID: ${id}`);
      const response = await API.delete(`/${id}`);
      console.log('[debt API] Deleted debt:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error deleting debt:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete debt');
    }
  },

  getRepaymentStrategies: async () => {
    try {
      console.log('[debt API] Fetching repayment strategies...');
      const response = await API.get('/strategies');
      console.log('[debt API] Fetched repayment strategies:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error fetching repayment strategies:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch repayment strategies');
    }
  },

  recordPayment: async (id, payment) => {
    try {
      console.log(`[debt API] Recording payment for debt ${id}:`, payment);
      const response = await API.post(`/${id}/payment`, payment);
      console.log('[debt API] Recorded payment:', response.data);
      return response.data;
    } catch (error) {
      console.error('[debt API] Error recording payment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to record payment');
    }
  },
};

export default debtService;
