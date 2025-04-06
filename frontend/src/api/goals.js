import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/goals",
});

// Attach token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Goals API - Token being sent:", token); // Debug log
  console.log("Goals API - Request URL:", config.url); // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Goals API - 401 detected, clearing token and redirecting");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Fetch all goals
export const fetchGoals = async (filters = {}) => {
  try {
    const response = await API.get("", { params: filters });
    console.log("Fetched goals data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new goal
export const createGoal = async (goalData) => {
  try {
    const response = await API.post("", goalData);
    return response.data;
  } catch (error) {
    console.error("Error creating goal:", error.response?.data || error.message);
    throw error;
  }
};

// Update goal (not currently used, but keeping for completeness)
export const updateGoal = async (goalId, goalData) => {
  try {
    const response = await API.put(`/${goalId}`, goalData);
    return response.data;
  } catch (error) {
    console.error("Error updating goal:", error.response?.data || error.message);
    throw error;
  }
};

// Mark goal as complete
export const markGoalAsComplete = async (goalId) => {
  try {
    const response = await API.patch(`/${goalId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error marking goal complete:", error.response?.data || error.message);
    throw error;
  }
};

// Update goal progress
export const updateGoalProgress = async (goalId, currentAmount) => {
  try {
    const response = await API.patch(`/${goalId}/progress`, { currentAmount });
    return response.data;
  } catch (error) {
    console.error("Error updating progress:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch filtered and sorted goals (optional filters)
export const fetchFilteredAndSortedGoals = async (filters) => {
  try {
    const response = await API.get("", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered goals:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (goalId) => {
  try {
    const response = await API.delete(`/${goalId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting goal:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch notifications related to goals
export const fetchGoalNotifications = async () => {
  try {
    const response = await API.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};