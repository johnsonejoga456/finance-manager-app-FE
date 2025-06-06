import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No JWT token found in localStorage. Please log in.');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      return await axios.get(API_URL, { headers: getAuthHeader(), params });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  },
  addTransaction: async (transactionData) => {
    try {
      return await axios.post(API_URL, transactionData, { headers: getAuthHeader() });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to add transaction: ${error.message}`);
    }
  },
  updateTransaction: async (id, data) => {
    try {
      return await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  },
  deleteTransaction: async (id) => {
    try {
      return await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  },
  importCSV: async (formData) => {
    try {
      return await axios.post(`${API_URL}/import/csv`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to import CSV: ${error.message}`);
    }
  },
  exportTransactions: async () => {
    try {
      return await axios.get(`${API_URL}/export/csv`, {
        headers: getAuthHeader(),
        responseType: 'blob',
      });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to export CSV: ${error.message}`);
    }
  },
  exportTransactionsAsPDF: async () => {
    try {
      return await axios.get(`${API_URL}/export/pdf`, {
        headers: getAuthHeader(),
        responseType: 'blob',
      });
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to export PDF: ${error.message}`);
    }
  },
};

export default transactionService;