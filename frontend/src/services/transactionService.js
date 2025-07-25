import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/transactions`;

// Create reusable axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically with logs
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[transaction API] Attached Authorization header.');
  } else {
    console.warn('[transaction API] No token found in localStorage.');
  }
  console.log('[transaction API] Request:', config);
  return config;
});

// Global 401 handling
API.interceptors.response.use(
  (response) => {
    console.log('[transaction API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[transaction API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('[transaction API] Unauthorized. Clearing token and redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      console.log('[transaction API] Fetching transactions with params:', params);
      const response = await API.get('/', { params });
      console.log('[transaction API] Fetched transactions:', response.data);
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error fetching transactions:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
  },

  addTransaction: async (transactionData) => {
    try {
      console.log('[transaction API] Adding transaction:', transactionData);
      const response = await API.post('/', transactionData);
      console.log('[transaction API] Added transaction:', response.data);
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error adding transaction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to add transaction');
    }
  },

  updateTransaction: async (id, data) => {
    try {
      console.log(`[transaction API] Updating transaction ${id}:`, data);
      const response = await API.put(`/${id}`, data);
      console.log('[transaction API] Updated transaction:', response.data);
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error updating transaction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update transaction');
    }
  },

  deleteTransaction: async (id) => {
    try {
      console.log(`[transaction API] Deleting transaction with ID: ${id}`);
      const response = await API.delete(`/${id}`);
      console.log('[transaction API] Deleted transaction:', response.data);
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error deleting transaction:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete transaction');
    }
  },

  importCSV: async (formData) => {
    try {
      console.log('[transaction API] Importing transactions via CSV...');
      const response = await API.post('/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[transaction API] Imported CSV:', response.data);
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error importing CSV:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to import CSV');
    }
  },

  exportTransactions: async () => {
    try {
      console.log('[transaction API] Exporting transactions to CSV...');
      const response = await API.get('/export/csv', { responseType: 'blob' });
      console.log('[transaction API] Exported CSV successfully.');
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error exporting CSV:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to export CSV');
    }
  },

  exportTransactionsAsPDF: async () => {
    try {
      console.log('[transaction API] Exporting transactions to PDF...');
      const response = await API.get('/export/pdf', { responseType: 'blob' });
      console.log('[transaction API] Exported PDF successfully.');
      return response.data;
    } catch (error) {
      console.error('[transaction API] Error exporting PDF:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to export PDF');
    }
  },
};

export default transactionService;
