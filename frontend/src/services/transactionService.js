import axios from 'axios';

const API_URL = '/api/transactions';

const transactionService = {
  addTransaction: (data) => axios.post(`${API_URL}`, data),
  getTransactions: (queryParams = '') => axios.get(`${API_URL}${queryParams}`),
  updateTransaction: (id, data) => axios.put(`${API_URL}/${id}`, data),
  deleteTransaction: (id) => axios.delete(`${API_URL}/${id}`),
  searchTransactions: (queryParams = '') => axios.get(`${API_URL}/search${queryParams}`),
  addRecurringTransaction: (data) => axios.post(`${API_URL}/recurring`, data),
  exportTransactionsCSV: () => axios.get(`${API_URL}/export/csv`, { responseType: 'blob' }),
  exportTransactionsPDF: () => axios.get(`${API_URL}/export/pdf`, { responseType: 'blob' }),
  getIncomeVsExpensesReport: () => axios.get(`${API_URL}/report/income-expenses`),
  getCategoricalBreakdown: () => axios.get(`${API_URL}/report/categories`),
  getBudgetStatus: (budget) => axios.get(`${API_URL}/budget?budget=${budget}`),
  getTotalIncomeAndExpenses: () => axios.get(`${API_URL}/summary`),
};

export default transactionService;
