import axios from 'axios';

const API_URL = 'http://localhost:5000/api/debts';

const debtService = {
  getDebts: async () => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  getDebtById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  createDebt: async (debt) => {
    const response = await axios.post(API_URL, debt, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  updateDebt: async (id, debt) => {
    const response = await axios.put(`${API_URL}/${id}`, debt, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  deleteDebt: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  getRepaymentStrategies: async () => {
    const response = await axios.get(`${API_URL}/strategies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  recordPayment: async (id, payment) => {
    const response = await axios.post(`${API_URL}/${id}/payment`, payment, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
};

export default debtService;