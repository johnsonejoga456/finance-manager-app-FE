import React, { useState, useEffect } from "react";

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
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <h2 className="text-lg font-bold">Something went wrong!</h2>
          <p>Please try again later or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const GoalForm = ({ goal = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "other",
    milestones: [],
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        targetAmount: goal.targetAmount || "",
        currentAmount: goal.currentAmount || "",
        deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {goal ? "Edit Goal" : "Add New Goal"}
        </h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
              Target Amount
            </label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700">
              Current Amount
            </label>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="savings">Savings</option>
            <option value="debt">Debt</option>
            <option value="investment">Investment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Milestones</label>
          <div className="mt-2 space-y-3">
            {formData.milestones.map((m, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="number"
                  value={m.amount}
                  onChange={(e) => handleMilestoneChange(index, e.target.value)}
                  className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Amount"
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition"
            >
              + Add Milestone
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Goal
          </button>
        </div>
      </form>
    </ErrorBoundary>
  );
};

export default GoalForm;