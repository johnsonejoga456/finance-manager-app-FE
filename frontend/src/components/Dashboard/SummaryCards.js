import PropTypes from "prop-types"
import {
  Wallet,
  Target,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PiggyBank,
} from "lucide-react"

const SummaryCards = ({ overview }) => {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const totalAccountsBalance = overview.accounts?.totalBalance ?? 0
  const totalTransactions = overview.transactions?.recent?.length ?? 0
  const totalBudgets = overview.budgets?.activeBudgets?.length ?? 0
  const totalGoals = overview.goals?.activeGoals?.length ?? 0
  const totalDebts = overview.debts?.totalDebt ?? 0
  const totalInvestmentsValue = overview.investments?.totalValue ?? 0

  // Calculate investment performance
  const totalInvestmentCost =
    overview.investments?.recentInvestments?.reduce((sum, inv) => sum + (inv.initialInvestment || 0), 0) ?? 0
  const investmentGain = totalInvestmentsValue - totalInvestmentCost
  const investmentGainPercent = totalInvestmentCost > 0 ? (investmentGain / totalInvestmentCost) * 100 : 0

  // Calculate net worth
  const netWorth = totalAccountsBalance + totalInvestmentsValue - totalDebts

  const cards = [
    {
      title: "Net Worth",
      value: netWorth,
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      format: "currency",
      trend: netWorth > 0 ? "up" : "down",
    },
    {
      title: "Account Balance",
      value: totalAccountsBalance,
      icon: Wallet,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      format: "currency",
      trend: "neutral",
    },
    {
      title: "Investments",
      value: totalInvestmentsValue,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      format: "currency",
      trend: investmentGain >= 0 ? "up" : "down",
      subtitle: `${investmentGain >= 0 ? "+" : ""}$${Math.abs(investmentGain).toFixed(0)} (${investmentGainPercent.toFixed(1)}%)`,
    },
    {
      title: "Total Debt",
      value: totalDebts,
      icon: CreditCard,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      format: "currency",
      trend: "down",
    },
    {
      title: "Active Goals",
      value: totalGoals,
      icon: Target,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      format: "number",
      trend: "neutral",
    },
    {
      title: "Active Budgets",
      value: totalBudgets,
      icon: PiggyBank,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      format: "number",
      trend: "neutral",
    },
  ]

  const formatValue = (value, format) => {
    if (format === "currency") {
      return `$${Math.abs(value).toLocaleString()}`
    }
    return value.toLocaleString()
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-lg shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              {getTrendIcon(card.trend)}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <div className="flex items-baseline space-x-2">
                <p
                  className={`text-2xl font-bold ${
                    card.format === "currency" && card.value < 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatValue(card.value, card.format)}
                </p>
                {card.format === "currency" && card.value < 0 && (
                  <span className="text-xs text-red-500 font-medium">debt</span>
                )}
              </div>

              {card.subtitle && (
                <p className={`text-xs font-medium ${investmentGain >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

SummaryCards.propTypes = {
  overview: PropTypes.object,
}

export default SummaryCards