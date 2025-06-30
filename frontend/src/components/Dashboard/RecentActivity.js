import PropTypes from "prop-types"
import { ArrowUpRight, ArrowDownRight, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react"

const RecentActivity = ({ overview }) => {
  const recentTransactions = overview?.transactions?.recent || []
  const recentInvestments = overview?.investments?.recentInvestments || []

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const getTransactionIcon = (type, amount) => {
    if (type === "income" || amount > 0) {
      return <ArrowUpRight className="h-4 w-4 text-emerald-600" />
    }
    return <ArrowDownRight className="h-4 w-4 text-red-600" />
  }

  const getTransactionColor = (type, amount) => {
    if (type === "income" || amount > 0) {
      return "text-emerald-600"
    }
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Latest financial activity</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">{recentTransactions.length} transactions</div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No recent transactions</p>
            <p className="text-sm text-gray-400">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.slice(0, 6).map((tx, index) => (
              <div
                key={tx._id || index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">{getTransactionIcon(tx.type, tx.amount)}</div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.notes || tx.category || "Transaction"}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(tx.date || tx.createdAt)}</span>
                      {tx.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{tx.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(tx.type, tx.amount)}`}>
                    {tx.type === "income" || tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                  </p>
                  {tx.account && <p className="text-xs text-gray-500">{tx.account}</p>}
                </div>
              </div>
            ))}

            {recentTransactions.length > 6 && (
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  View all transactions
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Investments */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Investments</h3>
              <p className="text-sm text-gray-500">Portfolio performance overview</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">{recentInvestments.length} investments</div>
        </div>

        {recentInvestments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No recent investments</p>
            <p className="text-sm text-gray-400">Your investment portfolio will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvestments.slice(0, 6).map((inv, index) => {
              const gain = inv.currentValue - inv.initialInvestment
              const gainPercent = (gain / inv.initialInvestment) * 100
              const isPositive = gain >= 0

              return (
                <div
                  key={inv._id || index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald-100" : "bg-red-100"}`}>
                      <TrendingUp
                        className={`h-4 w-4 ${
                          isPositive ? "text-emerald-600" : "text-red-600"
                        } ${!isPositive ? "rotate-180" : ""}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{inv.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="capitalize">{inv.type}</span>
                        {inv.institution && (
                          <>
                            <span>•</span>
                            <span>{inv.institution}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${inv.currentValue.toFixed(2)}</p>
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                        {isPositive ? "+" : ""}${gain.toFixed(2)}
                      </span>
                      <span className={`text-xs ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                        ({isPositive ? "+" : ""}
                        {gainPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {recentInvestments.length > 6 && (
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm py-2 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                  View all investments
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

RecentActivity.propTypes = {
  overview: PropTypes.object.isRequired,
}

export default RecentActivity