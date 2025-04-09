import React, { useState, useEffect } from "react";

const GoalForm = ({ goal = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    currency: "USD",
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
        currency: goal.currency || "USD",
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto p-4 sm:p-0">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 sticky top-0 bg-white z-10 pb-2">
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
          className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
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
          className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
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
            className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
          >
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="JPY">¥ JPY</option>
            <option value="CAD">$ CAD</option>
          </select>
        </div>
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
          className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
        />
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
          className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
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
          className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
        >
          <option value="savings">Savings</option>
          <option value="debt">Debt</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Milestones</label>
        <div className="mt-2 space-y-2 sm:space-y-3">
          {formData.milestones.map((m, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <input
                type="number"
                value={m.amount}
                onChange={(e) => handleMilestoneChange(index, e.target.value)}
                className="w-24 sm:w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
                placeholder="Amount"
              />
              <button
                type="button"
                onClick={() => removeMilestone(index)}
                className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMilestone}
            className="mt-2 text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm font-medium transition"
          >
            + Add Milestone
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white pt-4 pb-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;