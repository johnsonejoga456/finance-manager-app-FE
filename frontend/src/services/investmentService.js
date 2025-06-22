import axios from 'axios';

const API_URL = 'http://localhost:5000/api/investments';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('Sending token:', token); // Debug log
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const investmentService = {
  getInvestments: async (params) => {
    try {
      const response = await axios.get(API_URL, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
  addInvestment: async (data) => {
    try {
      const response = await axios.post(API_URL, { ...data, currencyType: data.currency }, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
  updateInvestment: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { ...data, currencyType: data.currency }, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
  deleteInvestment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
  exportToCSV: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/csv`, {
        responseType: 'blob',
        headers: getAuthHeader(),
      });
      return response;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
  exportToPDF: async () => {
    try {
      const response = await axios.get(`${API_URL}/export/pdf`, {
        responseType: 'blob',
        headers: getAuthHeader(),
      });
      return response;
    } catch (err) {
      throw new Error(err.response?.status === 401 ? 'Session expired' : err.message);
    }
  },
};

export default investmentService;