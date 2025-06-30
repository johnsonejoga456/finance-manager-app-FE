import PropTypes from "prop-types"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { PieChartIcon, BarChart3, Activity } from "lucide-react"

const COLORS = {
  primary: "#003366",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  indigo: "#6366F1",
  pink: "#EC4899",
}

const DashboardCharts = ({ overview }) => {
  const recentInvestments = overview?.investments?.recentInvestments || []
  const accounts = overview?.accounts?.topAccounts || []
  const budgets = overview?.budgets?.activeBudgets || []

  // Prepare investment data for pie chart
  const investmentData = recentInvestments.reduce((acc, inv) => {
    const existing = acc.find((item) => item.name === inv.type)
    if (existing) {
      existing.value += inv.currentValue
    } else {
      acc.push({
        name: inv.type,
        value: inv.currentValue,
        count: 1,
      })
    }
    return acc
  }, [])

  // Prepare account balance data for bar chart
  const accountData = accounts.slice(0, 6).map((account) => ({
    name: account.name.length > 10 ? account.name.substring(0, 10) + "..." : account.name,
    balance: account.balance,
    type: account.type,
  }))

  // Prepare budget utilization data
  const budgetData = budgets.slice(0, 5).map((budget) => ({
    name: budget.category.length > 8 ? budget.category.substring(0, 8) + "..." : budget.category,
    spent: budget.spent || 0,
    limit: budget.limit,
    utilization: ((budget.spent || 0) / budget.limit) * 100,
  }))

  const renderCustomTooltip = (value, name, props) => {
    if (name === "balance") {
      return [`$${value.toLocaleString()}`, "Balance"]
    }
    if (name === "value") {
      return [`$${value.toLocaleString()}`, props.payload.name]
    }
    return [value, name]
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {/* Investment Portfolio Distribution */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Distribution</h3>
              <p className="text-sm text-gray-500">Investment allocation by type</p>
            </div>
          </div>
        </div>

        {investmentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <PieChartIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No investment data available</p>
            <p className="text-sm text-gray-400">Add investments to see portfolio distribution</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {investmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip formatter={renderCustomTooltip} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Account Balances */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Balances</h3>
              <p className="text-sm text-gray-500">Top accounts by balance</p>
            </div>
          </div>
        </div>

        {accountData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No account data available</p>
            <p className="text-sm text-gray-400">Add accounts to see balance overview</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accountData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={renderCustomTooltip}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="balance" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Budget Utilization */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Budget Utilization</h3>
              <p className="text-sm text-gray-500">Spending vs budget limits</p>
            </div>
          </div>
        </div>

        {budgetData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No budget data available</p>
            <p className="text-sm text-gray-400">Create budgets to track spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgetData.map((budget, index) => {
              const utilizationPercent = Math.min(budget.utilization, 100)
              const isOverBudget = budget.utilization > 100

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{budget.name}</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? "text-red-600" : "text-gray-600"}`}>
                      ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOverBudget
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : utilizationPercent > 80
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      }`}
                      style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isOverBudget ? "text-red-600" : "text-gray-500"}`}>
                      {utilizationPercent.toFixed(1)}% utilized
                    </span>
                    {isOverBudget && <span className="text-xs text-red-600 font-medium">Over budget!</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

DashboardCharts.propTypes = {
  overview: PropTypes.object.isRequired,
}

export default DashboardCharts
