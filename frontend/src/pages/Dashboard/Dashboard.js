"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PiggyBank,
  Target,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Settings,
  Bell,
} from "lucide-react"

import { getDashboardSummary } from "../../services/dashboardService"
import SummaryCards from "../../components/Dashboard/SummaryCards"
import DashboardCharts from "../../components/Dashboard/DashboardCharts"
import RecentActivity from "../../components/Dashboard/RecentActivity"

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      const data = await getDashboardSummary()
      setOverview(data)
    } catch (err) {
      console.error("Fetch dashboard error:", err.message)
      toast.error(err.message)
      if (err.message.includes("Unauthorized")) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to view the dashboard")
      navigate("/login")
      return
    }

    fetchData()
  }, [navigate])

  const handleRefresh = () => {
    fetchData(true)
  }

  const navigationItems = [
    { name: "Accounts", path: "/accounts", icon: Wallet, color: "text-blue-600" },
    { name: "Transactions", path: "/transactions", icon: Receipt, color: "text-emerald-600" },
    { name: "Budgets", path: "/budgets", icon: PiggyBank, color: "text-amber-600" },
    { name: "Goals", path: "/goals", icon: Target, color: "text-indigo-600" },
    { name: "Debts", path: "/debts", icon: CreditCard, color: "text-red-600" },
    { name: "Investments", path: "/investments", icon: TrendingUp, color: "text-purple-600" },
  ]

  const hasData =
    overview &&
    (overview.accounts?.topAccounts?.length ||
      overview.transactions?.recent?.length ||
      overview.budgets?.activeBudgets?.length ||
      overview.goals?.activeGoals?.length ||
      overview.debts?.totalDebt ||
      overview.investments?.recentInvestments?.length)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mb-3"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <LayoutDashboard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview for today.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                    <span className="font-medium text-gray-900 group-hover:text-gray-700">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        {!hasData ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <LayoutDashboard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Your Financial Dashboard</h3>
              <p className="text-gray-600 mb-8">
                Get started by adding your financial data. Your dashboard will show comprehensive insights once you have
                accounts, transactions, budgets, goals, debts, or investments.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/accounts"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Add Accounts
                </Link>
                <Link
                  to="/transactions"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Add Transactions
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <SummaryCards overview={overview} />
            <DashboardCharts overview={overview} />
            <RecentActivity overview={overview} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard