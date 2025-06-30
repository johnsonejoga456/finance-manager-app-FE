"use client"

import { useState } from "react"
import MilestoneList from "./MilestoneList"

const GoalCard = ({ goal, onEdit, onDelete, onMarkComplete, onUpdateProgress, onUpdateMilestones }) => {
  const [progressInput, setProgressInput] = useState("")
  const [milestoneInput, setMilestoneInput] = useState("")

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
  }

  const handleProgressSubmit = (e) => {
    e.preventDefault()
    if (progressInput && !isNaN(progressInput)) {
      onUpdateProgress(goal._id, Number(progressInput))
      setProgressInput("")
    }
  }

  const handleMilestoneSubmit = (e) => {
    e.preventDefault()
    if (milestoneInput && !isNaN(milestoneInput)) {
      const newMilestones = [...goal.milestones, { amount: Number(milestoneInput), achieved: false }]
      onUpdateMilestones(goal._id, newMilestones)
      setMilestoneInput("")
    }
  }

  const getProgressColor = () => {
    if (goal.progress >= 100) return "bg-emerald-500"
    if (goal.progress >= 75) return "bg-blue-500"
    if (goal.progress >= 50) return "bg-amber-500"
    return "bg-orange-500"
  }

  const getProgressBgColor = () => {
    if (goal.progress >= 100) return "bg-emerald-100"
    if (goal.progress >= 75) return "bg-blue-100"
    if (goal.progress >= 50) return "bg-amber-100"
    return "bg-orange-100"
  }

  const getCategoryIcon = (category) => {
    const icons = {
      savings: "💰",
      debt: "💳",
      investment: "📈",
      other: "🎯",
    }
    return icons[category] || "🎯"
  }

  const isNearDeadline = () => {
    const deadline = new Date(goal.deadline)
    const today = new Date()
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    return daysLeft <= 30 && daysLeft > 0
  }

  const isOverdue = () => {
    const deadline = new Date(goal.deadline)
    const today = new Date()
    return deadline < today && goal.status !== "completed"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-50 rounded-full p-2 mr-3">
            <span className="text-xl">{getCategoryIcon(goal.category)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{goal.title}</h3>
            <p className="text-sm text-gray-600 capitalize">{goal.category}</p>
          </div>
        </div>
        {isOverdue() && (
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">Overdue</span>
        )}
        {isNearDeadline() && !isOverdue() && (
          <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">Due Soon</span>
        )}
      </div>

      {/* Description */}
      {goal.description && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{goal.description}</p>
        </div>
      )}

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-800">{goal.progress.toFixed(1)}%</span>
        </div>

        <div className={`w-full ${getProgressBgColor()} rounded-full h-3 overflow-hidden mb-3`}>
          <div
            className={`${getProgressColor()} h-3 rounded-full transition-all duration-500 relative`}
            style={{ width: `${Math.min(goal.progress, 100)}%` }}
          >
            {goal.progress >= 100 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {currencySymbols[goal.currency]}
            {goal.currentAmount.toLocaleString()}
          </span>
          <span className="font-semibold text-gray-800">
            {currencySymbols[goal.currency]}
            {goal.targetAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Deadline */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
      </div>

      {/* Milestones */}
      <MilestoneList milestones={goal.milestones} currency={goal.currency} />

      {/* Action Forms */}
      <div className="space-y-3 mt-6 pt-4 border-t border-gray-100">
        {/* Progress Update Form */}
        <form onSubmit={handleProgressSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-500 text-sm">{currencySymbols[goal.currency]}</span>
            <input
              type="number"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              placeholder="Add amount"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Update
          </button>
        </form>

        {/* Milestone Form */}
        <form onSubmit={handleMilestoneSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-500 text-sm">{currencySymbols[goal.currency]}</span>
            <input
              type="number"
              value={milestoneInput}
              onChange={(e) => setMilestoneInput(e.target.value)}
              placeholder="Add milestone"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Add
          </button>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        {goal.status === "in-progress" && goal.progress >= 100 && (
          <button
            onClick={() => onMarkComplete(goal._id)}
            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Complete
          </button>
        )}

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => onEdit(goal)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalCard
