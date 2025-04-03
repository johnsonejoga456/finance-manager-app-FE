import React, { useState, useEffect } from "react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error occurred in GoalForm:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="text-lg font-bold">Something went wrong!</h2>
          <p>Please try again later or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main GoalForm Component
const GoalForm = ({ goal = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "other",
    milestones: [], // Array of { amount: Number }
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        targetAmount: goal.targetAmount || "",
        currentAmount: goal.currentAmount || "",
        deadline: goal.deadline ? goal.deadline.split("T")[0] : "", // Format for date input
        category: goal.category || "other",
        milestones: goal.milestones || [],
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMilestoneChange = (index, value) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = { amount: Number(value), achieved: false };
    setFormData((prev) => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { amount: 0, achieved: false }],
    }));
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
    });
  };

  return (
    <ErrorBoundary>
      <div className="p-4 bg-white shadow-md rounded">
        <h2 className="text-lg font-bold mb-4">
          {goal ? "Edit Goal" : "Add New Goal"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full p-2 border rounded"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="targetAmount">
              Target Amount
            </label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              className="w-full p-2 border rounded"
              value={formData.targetAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="currentAmount">
              Current Amount
            </label>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              className="w-full p-2 border rounded"
              value={formData.currentAmount}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="deadline">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="w-full p-2 border rounded"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="savings">Savings</option>
              <option value="debt">Debt</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1">Milestones</label>
            {formData.milestones.map((m, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => handleMilestoneChange(index, e.target.value)}
                  className="p-2 border rounded w-32"
                  placeholder="Milestone amount"
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="text-blue-500 hover:underline"
            >
              Add Milestone
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default GoalForm;