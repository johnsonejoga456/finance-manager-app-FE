"use client"

import { useState, useEffect } from "react"

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
  })

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
      })
    }
  }, [goal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMilestoneChange = (index, value) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { amount: Number(value), achieved: false }
    setFormData((prev) => ({ ...prev, milestones: newMilestones }))
  }

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { amount: 0, achieved: false }],
    }))
  }

  const removeMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.targetAmount || !formData.deadline) {
      alert("Please fill in all required fields.")
      return
    }

    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
    })
  }

  const inputClasses =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

  const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-emerald-50 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{goal ? "Edit Goal" : "Create New Goal"}</h2>
            <p className="text-sm text-gray-600">Set up your financial target</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField label="Goal Title" required>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., Emergency Fund, New Car, Vacation"
                required
              />
            </FormField>
          </div>

          <FormField label="Category" required>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="savings">💰 Savings</option>
              <option value="debt">💳 Debt Payoff</option>
              <option value="investment">📈 Investment</option>
              <option value="other">🎯 Other</option>
            </select>
          </FormField>

          <FormField label="Currency" required>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="USD">🇺🇸 USD - US Dollar</option>
              <option value="EUR">🇪🇺 EUR - Euro</option>
              <option value="GBP">🇬🇧 GBP - British Pound</option>
              <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
              <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
            </select>
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Description">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${inputClasses} resize-none`}
            rows="3"
            placeholder="Describe your goal and why it's important to you..."
          />
        </FormField>

        {/* Financial Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Target Amount" required>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-medium">
                {formData.currency === "USD" && "$"}
                {formData.currency === "EUR" && "€"}
                {formData.currency === "GBP" && "£"}
                {formData.currency === "JPY" && "¥"}
                {formData.currency === "CAD" && "$"}
              </span>
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className={`${inputClasses} pl-8`}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </FormField>

          <FormField label="Current Amount">
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-medium">
                {formData.currency === "USD" && "$"}
                {formData.currency === "EUR" && "€"}
                {formData.currency === "GBP" && "£"}
                {formData.currency === "JPY" && "¥"}
                {formData.currency === "CAD" && "$"}
              </span>
              <input
                type="number"
                id="currentAmount"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                className={`${inputClasses} pl-8`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </FormField>
        </div>

        {/* Deadline */}
        <FormField label="Target Deadline" required>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={inputClasses}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </FormField>

        {/* Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">Milestones</label>
            <button
              type="button"
              onClick={addMilestone}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Milestone
            </button>
          </div>

          {formData.milestones.length > 0 ? (
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-gray-500 text-sm">
                      {formData.currency === "USD" && "$"}
                      {formData.currency === "EUR" && "€"}
                      {formData.currency === "GBP" && "£"}
                      {formData.currency === "JPY" && "¥"}
                      {formData.currency === "CAD" && "$"}
                    </span>
                    <input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <p className="text-sm">No milestones added yet</p>
              <p className="text-xs text-gray-400">Add milestones to track your progress</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {goal ? "Update Goal" : "Create Goal"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GoalForm