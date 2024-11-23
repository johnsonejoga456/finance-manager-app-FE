import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/goals';

// Fetch all goals
export const fetchGoals = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals`);
  return response.data;
};

// Create a new goal
export const createGoal = async (goalData) => {
  const response = await axios.post(`${API_BASE_URL}/goals`, goalData);
  return response.data;
};

// Update Goal
export const updateGoal = async (goalId, goalData) => {
  const response = await axios.put(`${API_BASE_URL}/goals/${goalId}`, goalData);
  return response.data;
}

// Update goal process
export const markGoalAsComplete = async (goalId) => {
    const response = await axios.patch(`${API_BASE_URL}/${goalId}/complete`);
    return response.data;
};

export const updateGoalProgress = async (goalId, currentAmount) => {
    const response = await axios.patch(`${API_BASE_URL}/${goalId}/progress`, { currentAmount });
    return response.data;
};

export const fetchFilteredAndSortedGoals = async (filters) => {
    const response = await axios.get(API_BASE_URL, { params: filters });
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
