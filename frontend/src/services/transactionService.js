import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const transactionService = {
  addTransaction: async (data) => {
    const response = await api.post('', data);
    return response.data.data;
  },
  getAllTransactions: async (queryParams = '') => {
    const response = await api.get(queryParams);
    return response.data.data;
  },
  getTransactionById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data.data;
  },
  updateTransaction: async (id, data) => {
    const response = await api.put(`/${id}`, data);
    return response.data.data;
  },
  deleteTransaction: async (id) => {
    await api.delete(`/${id}`);
  },
  bulkUpdateTransactions: async (data) => {
    const response = await api.post('/bulk', data);
    return response.data.data;
  },
  searchTransactions: async (queryParams = '') => {
    const response = await api.get(`/search${queryParams}`);
    return response.data.data;
  },
  exportTransactionsCSV: async () => {
    const response = await api.get('/export/csv', { responseType: 'blob' });
    return response.data;
  },
  exportTransactionsPDF: async () => {
    const response = await api.get('/export/pdf', { responseType: 'blob' });
    return response.data;
  },
  getBudgetStatus: async (budget) => {
    const response = await api.get(`/budget-status?budget=${budget}`);
    return response.data.data;
  },
  getTotalIncomeAndExpenses: async () => {
    const response = await api.get('/analytics/income-expenses');
    return response.data.data;
  },
  getIncomeVsExpensesReport: async () => {
    const response = await api.get('/analytics/income-vs-expenses');
    return response.data.data;
  },
  getCategoricalBreakdown: async () => {
    const response = await api.get('/analytics/expense-breakdown');
    return response.data.data;
  },
};

export default transactionService;