import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/budgets`;

// Create reusable axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach token and debug each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[budgets API] Attached Authorization header.');
  } else {
    console.warn('[budgets API] No token found in localStorage.');
  }
  console.log('[budgets API] Request:', config);
  return config;
});

// Global 401 handling
API.interceptors.response.use(
  (response) => {
    console.log('[budgets API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[budgets API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('[budgets API] Unauthorized. Clearing token and redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const budgetService = {
  getBudgets: async () => {
    try {
      console.log('[budgets API] Fetching budgets');
      const response = await API.get('/');
      console.log('[budgets API] Budgets fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error fetching budgets:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch budgets');
    }
  },

  createBudget: async (budget) => {
    try {
      console.log('[budgets API] Creating budget:', budget);
      const response = await API.post('/', budget);
      console.log('[budgets API] Budget created:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error creating budget:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create budget');
    }
  },

  updateBudget: async (id, budget) => {
    try {
      console.log(`[budgets API] Updating budget ${id}:`, budget);
      const response = await API.put(`/${id}`, budget);
      console.log('[budgets API] Budget updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error updating budget:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update budget');
    }
  },

  deleteBudget: async (id) => {
    try {
      console.log(`[budgets API] Deleting budget ${id}`);
      const response = await API.delete(`/${id}`);
      console.log('[budgets API] Budget deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error deleting budget:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete budget');
    }
  },

  getBudgetStatus: async () => {
    try {
      console.log('[budgets API] Fetching budget status');
      const response = await API.get('/status');
      console.log('[budgets API] Budget status:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error fetching budget status:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch budget status');
    }
  },

  getBudgetInsights: async () => {
    try {
      console.log('[budgets API] Fetching budget insights');
      const response = await API.get('/insights');
      console.log('[budgets API] Budget insights:', response.data);
      return response.data;
    } catch (error) {
      console.error('[budgets API] Error fetching budget insights:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch budget insights');
    }
  },
};
