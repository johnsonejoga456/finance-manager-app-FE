import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

const getDashboardSummary = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Unauthorized: Please log in');
  }
  try {
    const response = await axios.get(`${API_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error('Dashboard summary error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch dashboard summary');
  }
};

export { getDashboardSummary };