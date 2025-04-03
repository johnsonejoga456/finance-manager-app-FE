import React, { useState, useEffect } from "react";
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
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals and notifications on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [goalsData, notificationsData] = await Promise.all([
          fetchGoals({ status: "in-progress" }), // Default to in-progress goals
          fetchGoalNotifications(),
        ]);
        if (!Array.isArray(goalsData)) throw new Error("Invalid goals data format");
        setGoals(goalsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load goals or notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle save goal (create or update)
  const handleSaveGoal = async (goalData) => {
    try {
      if (selectedGoal) {
        // For now, we only support creating new goals in this flow
        setShowForm(false);
        setSelectedGoal(null);
        return;
      }
      const newGoal = await createGoal(goalData);
      setGoals((prev) => [...prev, newGoal]);
      setShowForm(false);
      setSelectedGoal(null);
      // Refresh notifications
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error saving goal:", error);
      setError("Failed to save goal.");
    }
  };

  // Handle mark goal as complete
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

  // Handle update progress
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

  // Handle delete goal
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

  // Open form for creating (editing not fully supported yet)
  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedGoal(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Goals</h1>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <h2 className="font-bold">Notifications</h2>
          <ul>
            {notifications.map((note, index) => (
              <li key={index} className="text-sm text-gray-700">
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowForm(true)}
      >
        Add New Goal
      </button>

      {showForm && (
        <GoalForm
          goal={selectedGoal}
          onSave={handleSaveGoal}
          onCancel={handleCancelForm}
        />
      )}

      {loading ? (
        <p>Loading goals...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : goals.length === 0 ? (
        <p>No goals available. Start by adding a new goal!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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