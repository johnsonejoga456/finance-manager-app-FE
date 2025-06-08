import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budgets';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Session expired. Please log in again.');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const budgetService = {
  getBudgets: async () => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch budgets');
    }
  },
  createBudget: async (budget) => {
    try {
      const response = await axios.post(API_URL, budget, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create budget');
    }
  },
  updateBudget: async (id, budget) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, budget, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update budget');
    }
  },
  deleteBudget: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete budget');
    }
  },
  getBudgetStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/status`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch budget status');
    }
  },
  getBudgetInsights: async () => {
    try {
      const response = await axios.get(`${API_URL}/insights`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch budget insights');
    }
  },
};