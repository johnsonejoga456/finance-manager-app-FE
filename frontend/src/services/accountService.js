import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const BASE_URL = process.env.REACT_APP_API_URL || (isDevelopment ? 'http://localhost:5000/api' : '');

const API = axios.create({
  baseURL: `${BASE_URL}/accounts`,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Attached Authorization header.');
  }
  console.log('[API] Request:', config);
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const accountService = {
  getAccounts: async () => {
    try {
      console.log('[accountService] Fetching accounts...');
      const response = await API.get('/');
      console.log('[accountService] Accounts response:', response.data);
      const { accounts, total } = response.data.data || { accounts: [], total: 0 };
      return { accounts, total };
    } catch (error) {
      console.error('[accountService] Error fetching accounts:', error.response?.data || error.message);
      throw error;
    }
  },

  addAccount: async (accountData) => {
    try {
      console.log('[accountService] Adding account:', accountData);
      const response = await API.post('/', accountData);
      console.log('[accountService] Add account response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[accountService] Error adding account:', error.response?.data || error.message);
      throw error;
    }
  },

  updateAccount: async (id, data) => {
    try {
      console.log(`[accountService] Updating account ${id}:`, data);
      const response = await API.put(`/${id}`, data);
      console.log('[accountService] Update account response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[accountService] Error updating account:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteAccount: async (id) => {
    try {
      console.log(`[accountService] Deleting account ${id}`);
      const response = await API.delete(`/${id}`);
      console.log('[accountService] Delete account response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[accountService] Error deleting account:', error.response?.data || error.message);
      throw error;
    }
  },

  getAccountTransactions: async (id, params = {}) => {
    try {
      console.log(`[accountService] Fetching transactions for account ${id} with params:`, params);
      const response = await API.get(`/${id}/transactions`, { params });
      console.log('[accountService] Account transactions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[accountService] Error fetching account transactions:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default accountService;
