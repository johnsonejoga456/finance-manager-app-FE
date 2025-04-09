import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchGoals,
  createGoal,
  markGoalAsComplete,
  updateGoalProgress,
  updateMilestones,
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
  const [view, setView] = useState("in-progress"); // Tabs: in-progress or completed
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const filters = { status: view };
        if (sortBy) filters.sortBy = sortBy;
        const [goalsData, notificationsData] = await Promise.all([
          fetchGoals(filters),
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
  }, [navigate, view, sortBy]);

  const handleSaveGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      if (view === "in-progress") setGoals((prev) => [...prev, newGoal]);
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
        view === "in-progress"
          ? prev.filter((goal) => goal._id !== goalId)
          : prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error marking goal complete:", error);
      setError(error.response?.data?.message || "Failed to mark goal as complete.");
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

  const handleUpdateMilestones = async (goalId, milestones) => {
    try {
      const updatedGoal = await updateMilestones(goalId, milestones);
      setGoals((prev) =>
        prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal))
      );
      const notificationsData = await fetchGoalNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error updating milestones:", error);
      setError("Failed to update milestones.");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-md py-4 mb-6 rounded-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
            Your Goals
          </h1>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Hey, {user.username}</span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Updates</h2>
            <ul className="space-y-2">
              {notifications.slice(0, 3).map((note, index) => ( // Limit to 3 for brevity
                <li key={index} className="text-sm text-gray-600">
                  {note.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setView("in-progress")}
            className={`pb-2 text-sm font-medium transition-all duration-300 ${
              view === "in-progress"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setView("completed")}
            className={`pb-2 text-sm font-medium transition-all duration-300 ${
              view === "completed"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          + Create Goal
        </button>
        <div className="flex items-center gap-3 bg-white rounded-full p-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700 pl-2">Sort:</span>
          <button
            onClick={() => setSortBy("")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              sortBy === "" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => setSortBy("progress")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              sortBy === "progress" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setSortBy("deadline")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              sortBy === "deadline" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-100"
            }`}
          >
            Deadline
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all animate-fade-in">
            <GoalForm
              goal={selectedGoal}
              onSave={handleSaveGoal}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-600 animate-pulse text-lg font-medium">
            Loading your goals...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-xl shadow-sm">
            {error}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center text-gray-600 bg-white p-6 rounded-xl shadow-sm">
            {view === "in-progress"
              ? "No goals in progress. Create one to get started!"
              : "No completed goals yet. Keep pushing!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onMarkComplete={handleMarkComplete}
                onUpdateProgress={handleUpdateProgress}
                onUpdateMilestones={handleUpdateMilestones}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;