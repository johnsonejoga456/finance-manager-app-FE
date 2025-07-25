import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/goals`;

// Create Axios instance
const API = axios.create({
  baseURL: API_URL,
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[goals API] Attached Authorization header.");
  }
  console.log("[goals API] Request:", config);
  return config;
});

// Global 401 handler
API.interceptors.response.use(
  (response) => {
    console.log("[goals API] Response:", response);
    return response;
  },
  (error) => {
    console.error("[goals API] Error response:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn("Session expired or unauthorized. Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchGoals = async (filters = {}) => {
  try {
    console.log("[goals API] Fetching goals with filters:", filters);
    const response = await API.get("/", { params: filters });
    console.log("[goals API] Goals fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error fetching goals:", error.response?.data || error.message);
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    console.log("[goals API] Creating goal:", goalData);
    const response = await API.post("/", goalData);
    console.log("[goals API] Goal created:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error creating goal:", error.response?.data || error.message);
    throw error;
  }
};

export const markGoalAsComplete = async (goalId) => {
  try {
    console.log(`[goals API] Marking goal as complete: ${goalId}`);
    const response = await API.patch(`/${goalId}/complete`);
    console.log("[goals API] Goal marked complete:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error marking goal complete:", error.response?.data || error.message);
    throw error;
  }
};

export const updateGoalProgress = async (goalId, currentAmount) => {
  try {
    console.log(`[goals API] Updating goal ${goalId} progress to:`, currentAmount);
    const response = await API.patch(`/${goalId}/progress`, { currentAmount });
    console.log("[goals API] Goal progress updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error updating progress:", error.response?.data || error.message);
    throw error;
  }
};

export const updateMilestones = async (goalId, milestones) => {
  try {
    console.log(`[goals API] Updating milestones for goal ${goalId}:`, milestones);
    const response = await API.patch(`/${goalId}/milestones`, { milestones });
    console.log("[goals API] Milestones updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error updating milestones:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchGoalNotifications = async () => {
  try {
    console.log("[goals API] Fetching goal notifications");
    const response = await API.get("/notifications");
    console.log("[goals API] Notifications fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    console.log(`[goals API] Deleting goal ${goalId}`);
    const response = await API.delete(`/${goalId}`);
    console.log("[goals API] Goal deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("[goals API] Error deleting goal:", error.response?.data || error.message);
    throw error;
  }
};
