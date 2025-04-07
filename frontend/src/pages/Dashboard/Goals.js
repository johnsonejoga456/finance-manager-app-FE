import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchGoals,
  createGoal,
  markGoalAsComplete,
  updateGoalProgress,
  deleteGoal,
  fetchGoalNotifications,
} from "../../api/goals";
import GoalCard from "../../components/Goals/GoalCard";
import GoalForm from "../../components/Goals/GoalForm";

const Goals = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const [goalsData, notificationsData] = await Promise.all([
          fetchGoals({ status: "in-progress" }),
          fetchGoalNotifications(),
        ]);
        if (!Array.isArray(goalsData)) throw new Error("Invalid goals data format");
        setGoals(goalsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load goals or notifications.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleSaveGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      setGoals((prev) => [...prev, newGoal]);
      setShowForm(false);
      setSelectedGoal(null);
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error saving goal:", error);
      setError("Failed to save goal.");
    }
  };

  const handleMarkComplete = async (goalId) => {
    try {
      const updatedGoal = await markGoalAsComplete(goalId);
      setGoals((prev) =>
        prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error marking goal complete:", error);
      setError("Failed to mark goal as complete.");
    }
  };

  const handleUpdateProgress = async (goalId, currentAmount) => {
    try {
      const updatedGoal = await updateGoalProgress(goalId, currentAmount);
      setGoals((prev) =>
        prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error updating progress:", error);
      setError("Failed to update progress.");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((goal) => goal._id !== goalId));
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal.");
    }
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedGoal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Financial Goals</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-6 p-4 bg-amber-100 rounded-lg shadow-sm border border-amber-200">
          <h2 className="text-lg font-medium text-amber-800">Notifications</h2>
          <ul className="mt-2 space-y-1">
            {notifications.map((note, index) => (
              <li key={index} className="text-sm text-amber-700">
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Goal Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105"
      >
        + Add New Goal
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <GoalForm
              goal={selectedGoal}
              onSave={handleSaveGoal}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">Loading goals...</div>
      ) : error ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
      ) : goals.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
          No goals yet. Start by adding a new one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onMarkComplete={handleMarkComplete}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;