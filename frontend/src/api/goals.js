import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/goals" });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchGoals = async (filters = {}) => {
  try {
    const response = await API.get("", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching goals:", error.response?.data || error.message);
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    const response = await API.post("", goalData);
    return response.data;
  } catch (error) {
    console.error("Error creating goal:", error.response?.data || error.message);
    throw error;
  }
};

export const markGoalAsComplete = async (goalId) => {
  try {
    const response = await API.patch(`/${goalId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error marking goal complete:", error.response?.data || error.message);
    throw error;
  }
};

export const updateGoalProgress = async (goalId, currentAmount) => {
  try {
    const response = await API.patch(`/${goalId}/progress`, { currentAmount });
    return response.data;
  } catch (error) {
    console.error("Error updating progress:", error.response?.data || error.message);
    throw error;
  }
};

export const updateMilestones = async (goalId, milestones) => {
  try {
    const response = await API.patch(`/${goalId}/milestones`, { milestones });
    return response.data;
  } catch (error) {
    console.error("Error updating milestones:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchGoalNotifications = async () => {
  try {
    const response = await API.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const response = await API.delete(`/${goalId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting goal:", error.response?.data || error.message);
    throw error;
  }
};