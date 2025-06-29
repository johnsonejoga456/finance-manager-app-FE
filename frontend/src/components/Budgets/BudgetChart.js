"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function BudgetChart({ budgetInsights }) {
  const chartData = {
    labels: budgetInsights.categories,
    datasets: [
      {
        label: "Spent",
        data: budgetInsights.spending.map((s) => s.spent),
        backgroundColor: [
          "#FF5722", // Coral/Orange for expenses
          "#4CAF50", // Emerald Green
          "#003366", // Deep Blue
          "#FFEB3B", // Warm Yellow
          "#9C27B0", // Purple accent
          "#FF9800", // Orange variant
          "#2196F3", // Blue variant
          "#4CAF50", // Green variant
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 8,
      },
      {
        label: "Budgeted",
        data: budgetInsights.spending.map((s) => s.budgeted),
        backgroundColor: [
          "#FF572240", // Semi-transparent versions
          "#4CAF5040",
          "#00336640",
          "#FFEB3B40",
          "#9C27B040",
          "#FF980040",
          "#2196F340",
          "#4CAF5040",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.parsed
            return `${label}: $${value.toFixed(2)}`
          },
        },
      },
    },
    cutout: "60%",
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-50 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Budget Insights</h3>
            <p className="text-sm text-gray-600">Spending vs. Budget by Category</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {budgetInsights.categories.length} Categories
        </div>
      </div>

      {budgetInsights.categories.length ? (
        <div className="relative">
          {/* Chart Container */}
          <div className="h-80 mb-6">
            <Doughnut data={chartData} options={options} />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                ${budgetInsights.spending.reduce((total, item) => total + item.budgeted, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Budgeted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                ${budgetInsights.spending.reduce((total, item) => total + item.spent, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Budget Data Available</h4>
          <p className="text-gray-500">Create your first budget to see insights and spending patterns.</p>
        </div>
      )}
    </div>
  )
}
