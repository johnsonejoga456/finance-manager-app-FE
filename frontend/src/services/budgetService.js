import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budgets';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const budgetService = {
  getBudgets: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  },

  createBudget: async (budget) => {
    const response = await axios.post(API_URL, budget, { headers: getAuthHeaders() });
    return response.data;
  },

  updateBudget: async (id, budget) => {
    const response = await axios.put(`${API_URL}/${id}`, budget, { headers: getAuthHeaders() });
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  },

  getBudgetStatus: async () => {
    const response = await axios.get(`${API_URL}/status`, { headers: getAuthHeaders() });
    return response.data;
  },

  getBudgetInsights: async () => {
    const response = await axios.get(`${API_URL}/insights`, { headers: getAuthHeaders() });
    return response.data;
  },
};