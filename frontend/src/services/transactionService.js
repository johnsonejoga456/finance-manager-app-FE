import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const getTransactions = async (params = {}) => {
  const token = localStorage.getItem('token');
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
};

const addTransaction = async (transactionData) => {
  const token = localStorage.getItem('token');
  return await axios.post(API_URL, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteTransaction = async (id) => {
  const token = localStorage.getItem('token');
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const importCSV = async (formData) => {
  const token = localStorage.getItem('token');
  return await axios.post(`${API_URL}/import/csv`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

const exportTransactions = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
};

const exportTransactionsAsPDF = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/export/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
};

const transactionService = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  importCSV,
  exportTransactions,
  exportTransactionsAsPDF,
};

export default transactionService;