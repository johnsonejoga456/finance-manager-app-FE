import axios from 'axios';

const API_URL = 'http://localhost:5000/api/accounts';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No JWT token found in localStorage. Please log in.');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const accountService = {
  getAccounts: async () => {
    try {
      console.log('Fetching accounts');
      const response = await axios.get(API_URL, { headers: getAuthHeader() });
      console.log('Accounts response:', response.data);
      const { accounts, total } = response.data.data || { accounts: [], total: 0 };
      return { accounts, total };
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }
},
  addAccount: async (accountData) => {
    try {
      console.log('Adding account:', accountData);
      const response = await axios.post(API_URL, accountData, { headers: getAuthHeader() });
      console.log('Add account response:', response.data);
      return response;
    } catch (error) {
      console.error('Error adding account:', error.message);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to add account: ${error.message}`);
    }
  },
  updateAccount: async (id, data) => {
    try {
      console.log(`Updating account ${id}:`, data);
      const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
      console.log('Update account response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating account:', error.message);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to update account: ${error.message}`);
    }
  },
  deleteAccount: async (id) => {
    try {
      console.log(`Deleting account ${id}`);
      const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
      console.log('Delete account response:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting account:', error.message);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  },
  getAccountTransactions: async (id, params = {}) => {
    try {
      console.log(`Fetching transactions for account ${id}`, params);
      const response = await axios.get(`${API_URL}/${id}/transactions`, { headers: getAuthHeader(), params });
      console.log('Account transactions response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching account transactions:', error.message);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch account transactions: ${error.message}`);
    }
  },
};

export default accountService;