import React, { useState, useEffect } from "react";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "../../api/goals";
import GoalCard from "../../components/Goals/GoalCard";
import GoalForm from "../../components/Goals/GoalForm";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null); // For editing
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch goals on component mount
  useEffect(() => {
    const getGoals = async () => {
      try {
        const data = await fetchGoals();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    getGoals();
  }, []);

  // Handle save goal (create or update)
  const handleSaveGoal = async (goalData) => {
    try {
      if (goalData.id) {
        // Update existing goal
        const updatedGoal = await updateGoal(goalData.id, goalData);
        setGoals((prev) =>
          prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
        );
      } else {
        // Create new goal
        const newGoal = await createGoal(goalData);
        setGoals((prev) => [...prev, newGoal]);
      }
      setShowForm(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  // Handle delete goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Open form for editing
  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  // Close the form
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedGoal(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default Goals;