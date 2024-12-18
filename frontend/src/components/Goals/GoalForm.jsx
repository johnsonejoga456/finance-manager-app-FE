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
  });

  // Populate form if editing an existing goal
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        targetAmount: goal.targetAmount || "",
        currentAmount: goal.currentAmount || "",
        deadline: goal.deadline || "",
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave(formData);
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
