"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import {
  fetchGoals,
  createGoal,
  markGoalAsComplete,
  updateGoalProgress,
  updateMilestones,
  deleteGoal,
  fetchGoalNotifications,
} from "../../api/goals"
import GoalCard from "../../components/Goals/GoalCard"
import GoalForm from "../../components/Goals/GoalForm"

const Goals = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [goals, setGoals] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState("in-progress")
  const [sortBy, setSortBy] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      try {
        setLoading(true)
        const filters = { status: view }
        if (sortBy) filters.sortBy = sortBy

        const [goalsData, notificationsData] = await Promise.all([fetchGoals(filters), fetchGoalNotifications()])

        if (!Array.isArray(goalsData)) throw new Error("Invalid goals data format")
        setGoals(goalsData)
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load goals or notifications.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate, view, sortBy])

  const handleSaveGoal = async (goalData) => {
    try {
      const newGoal = await createGoal(goalData)
      if (view === "in-progress") setGoals((prev) => [...prev, newGoal])
      setShowForm(false)
      setSelectedGoal(null)
      const notificationsData = await fetchGoalNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error saving goal:", error)
      setError("Failed to save goal.")
    }
  }

  const handleMarkComplete = async (goalId) => {
    try {
      const updatedGoal = await markGoalAsComplete(goalId)
      setGoals((prev) =>
        view === "in-progress"
          ? prev.filter((goal) => goal._id !== goalId)
          : prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal)),
      )
      const notificationsData = await fetchGoalNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error marking goal complete:", error)
      setError(error.response?.data?.message || "Failed to mark goal as complete.")
    }
  }

  const handleUpdateProgress = async (goalId, currentAmount) => {
    try {
      const updatedGoal = await updateGoalProgress(goalId, currentAmount)
      setGoals((prev) => prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal)))
      const notificationsData = await fetchGoalNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error updating progress:", error)
      setError("Failed to update progress.")
    }
  }

  const handleUpdateMilestones = async (goalId, milestones) => {
    try {
      const updatedGoal = await updateMilestones(goalId, milestones)
      setGoals((prev) => prev.map((goal) => (goal._id === updatedGoal._id ? updatedGoal : goal)))
      const notificationsData = await fetchGoalNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error updating milestones:", error)
      setError("Failed to update milestones.")
    }
  }

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId)
      setGoals((prev) => prev.filter((goal) => goal._id !== goalId))
      const notificationsData = await fetchGoalNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error deleting goal:", error)
      setError("Failed to delete goal.")
    }
  }

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setSelectedGoal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-emerald-600 rounded-xl p-3 mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
                <p className="text-gray-600 mt-1">Track and achieve your financial objectives</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Welcome, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-50 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Recent Updates</h2>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((note, index) => (
                <div key={index} className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {note.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === "in-progress" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                In Progress ({goals.filter((g) => g.status === "in-progress").length})
              </button>
              <button
                onClick={() => setView("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === "completed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Completed ({goals.filter((g) => g.status === "completed").length})
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Default</option>
                  <option value="progress">Progress</option>
                  <option value="deadline">Deadline</option>
                  <option value="amount">Target Amount</option>
                </select>
              </div>

              {/* Create Goal Button */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Goal
              </button>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your goals...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          ) : goals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {view === "in-progress" ? "No Goals in Progress" : "No Completed Goals"}
              </h3>
              <p className="text-gray-500 mb-6">
                {view === "in-progress"
                  ? "Create your first financial goal to start tracking your progress!"
                  : "Complete some goals to see them here!"}
              </p>
              {view === "in-progress" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Create Your First Goal
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <GoalForm goal={selectedGoal} onSave={handleSaveGoal} onCancel={handleCancelForm} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Goals