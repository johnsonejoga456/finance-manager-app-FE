"use client"

import { useEffect, useRef, useMemo } from "react"
import PropTypes from "prop-types"
import Chart from "chart.js/auto"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function BalanceChart({ transactions }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // Memoizing safeTransactions to avoid unnecessary re-renders
  const safeTransactions = useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions])

  useEffect(() => {
    if (!chartRef.current || safeTransactions.length === 0) return

    const ctx = chartRef.current.getContext("2d")

    const sortedTransactions = [...safeTransactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )

    const dates = sortedTransactions.map((tx) =>
      new Date(tx.date).toLocaleDateString()
    )
    const balances = sortedTransactions.reduce((acc, tx, idx) => {
      const prevBalance = idx === 0 ? 0 : acc[idx - 1]
      acc.push(prevBalance + (tx.type === "income" ? tx.amount : -tx.amount))
      return acc
    }, [])

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)")

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Account Balance",
            data: balances,
            borderColor: "#10B981",
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: "#10B981",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#10B981",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => `Date: ${context[0].label}`,
              label: (context) => `Balance: $${context.parsed.y.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
              color: "#6B7280",
              font: { size: 12, weight: "600" },
            },
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: { color: "#6B7280", font: { size: 11 } },
          },
          y: {
            title: {
              display: true,
              text: "Balance ($)",
              color: "#6B7280",
              font: { size: 12, weight: "600" },
            },
            beginAtZero: false,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: {
              color: "#6B7280",
              font: { size: 11 },
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [safeTransactions])

  const getBalanceStats = () => {
    if (safeTransactions.length === 0) return null

    const sortedTransactions = [...safeTransactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )
    const balances = sortedTransactions.reduce((acc, tx, idx) => {
      const prevBalance = idx === 0 ? 0 : acc[idx - 1]
      acc.push(prevBalance + (tx.type === "income" ? tx.amount : -tx.amount))
      return acc
    }, [])

    const currentBalance = balances[balances.length - 1] || 0
    const previousBalance = balances[balances.length - 2] || 0
    const change = currentBalance - previousBalance
    const changePercent = previousBalance !== 0 ? (change / Math.abs(previousBalance)) * 100 : 0

    return {
      current: currentBalance,
      change,
      changePercent,
      isPositive: change >= 0,
    }
  }

  const stats = getBalanceStats()

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800">Balance Trend</h4>
            <p className="text-sm text-gray-500">Account balance over time</p>
          </div>
        </div>

        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              ${stats.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div
              className={`flex items-center justify-end space-x-1 text-sm font-medium ${
                stats.isPositive ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {stats.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>
                {stats.isPositive ? "+" : "-"}${
                  Math.abs(stats.change).toLocaleString("en-US", { minimumFractionDigits: 2 })
                }
                {stats.changePercent !== 0 && (
                  <span className="ml-1">
                    ({stats.isPositive ? "+" : ""}{stats.changePercent.toFixed(1)}%)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {safeTransactions.length > 0 ? (
        <div className="h-80">
          <canvas ref={chartRef} />
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No transaction data available</p>
            <p className="text-sm text-gray-400">Add some transactions to see the balance trend</p>
          </div>
        </div>
      )}
    </div>
  )
}

BalanceChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
}