import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export const fetchGoals = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals`);
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await axios.post(`${API_BASE_URL}/goals`, goalData);
  return response.data;
};

export const updateGoal = async (goalId, goalData) => {
  const response = await axios.put(`${API_BASE_URL}/goals/${goalId}`, goalData);
  return response.data;
};

export const deleteGoal = async (goalId) => {
  const response = await axios.delete(`${API_BASE_URL}/goals/${goalId}`);
  return response.data;
};

// Fetch notifications related to goals
export const fetchGoalNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals/notifications`);
  return response.data;
};
