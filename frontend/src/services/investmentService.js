import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/investments`;

// Create reusable axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT automatically and log
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[investment API] Attached Authorization header.');
  } else {
    console.warn('[investment API] No token found in localStorage.');
  }
  console.log('[investment API] Request:', config);
  return config;
});

// Global 401 handling
API.interceptors.response.use(
  (response) => {
    console.log('[investment API] Response:', response);
    return response;
  },
  (error) => {
    console.error('[investment API] Error response:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn('[investment API] Unauthorized. Clearing token and redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const investmentService = {
  getInvestments: async (page = 1, limit = 10) => {
    try {
      console.log(`[investment API] Fetching investments (page ${page}, limit ${limit})...`);
      const response = await API.get(`/?page=${page}&limit=${limit}`);
      console.log('[investment API] Fetched investments:', response.data);
      return response.data;
    } catch (error) {
      console.error('[investment API] Error fetching investments:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch investments');
    }
  },

  addInvestment: async (data) => {
    try {
      console.log('[investment API] Adding investment:', data);
      const response = await API.post('/', data);
      console.log('[investment API] Added investment:', response.data);
      return response.data;
    } catch (error) {
      console.error('[investment API] Error adding investment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to add investment');
    }
  },

  updateInvestment: async (id, data) => {
    try {
      console.log(`[investment API] Updating investment ${id}:`, data);
      const response = await API.put(`/${id}`, data);
      console.log('[investment API] Updated investment:', response.data);
      return response.data;
    } catch (error) {
      console.error('[investment API] Error updating investment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update investment');
    }
  },

  deleteInvestment: async (id) => {
    try {
      console.log(`[investment API] Deleting investment with ID: ${id}`);
      const response = await API.delete(`/${id}`);
      console.log('[investment API] Deleted investment:', response.data);
      return response.data;
    } catch (error) {
      console.error('[investment API] Error deleting investment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete investment');
    }
  },

  exportCSV: async () => {
    try {
      console.log('[investment API] Exporting investments to CSV...');
      const response = await API.get('/export/csv', { responseType: 'blob' });
      console.log('[investment API] CSV export successful.');
      return response.data;
    } catch (error) {
      console.error('[investment API] Error exporting CSV:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to export CSV');
    }
  },

  exportPDF: async () => {
    try {
      console.log('[investment API] Exporting investments to PDF...');
      const response = await API.get('/export/pdf', { responseType: 'blob' });
      console.log('[investment API] PDF export successful.');
      return response.data;
    } catch (error) {
      console.error('[investment API] Error exporting PDF:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to export PDF');
    }
  },
};

// ✅ ADD NAMED EXPORTS to match your existing `Investments.js` page:
export const getInvestments = investmentService.getInvestments;
export const addInvestment = investmentService.addInvestment;
export const updateInvestment = investmentService.updateInvestment;
export const deleteInvestment = investmentService.deleteInvestment;
export const exportCSV = investmentService.exportCSV;
export const exportPDF = investmentService.exportPDF;

export default investmentService;
