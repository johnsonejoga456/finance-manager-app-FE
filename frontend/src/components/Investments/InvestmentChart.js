"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import PropTypes from "prop-types"
import { TrendingUp, PieChart, BarChart3 } from "lucide-react"

const investmentTypes = ["stock", "bond", "mutual fund", "ETF", "real estate", "crypto"]

const COLORS = [
  "rgba(16, 185, 129, 0.8)", // Emerald
  "rgba(59, 130, 246, 0.8)", // Blue
  "rgba(245, 158, 11, 0.8)", // Amber
  "rgba(239, 68, 68, 0.8)", // Red
  "rgba(139, 92, 246, 0.8)", // Violet
  "rgba(34, 197, 94, 0.8)", // Green
]

const InvestmentChart = ({ investments, chartType }) => {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (!Array.isArray(investments) || investments.length === 0) return

    const ctx = chartRef.current.getContext("2d")

    // Cleanup previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    let config = {}

    if (chartType === "time") {
      // Line Chart: Total Portfolio Value over time
      const sorted = [...investments].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))
      const labels = sorted.map((inv) => new Date(inv.purchaseDate).toLocaleDateString())
      const values = sorted.reduce((acc, inv, idx) => {
        const prev = idx > 0 ? acc[idx - 1] : 0
        return [...acc, prev + (inv.currentValue || 0)]
      }, [])

      config = {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Portfolio Value ($)",
              data: values,
              borderColor: "rgba(16, 185, 129, 1)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "rgba(16, 185, 129, 1)",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  weight: "500",
                },
              },
            },
            title: {
              display: true,
              text: "Portfolio Growth Over Time",
              font: {
                size: 16,
                weight: "bold",
              },
              padding: 20,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: (context) => `Portfolio Value: $${context.parsed.y.toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Purchase Date",
                font: {
                  weight: "600",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Value ($)",
                font: {
                  weight: "600",
                },
              },
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                callback: (value) => "$" + value.toLocaleString(),
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      }
    } else {
      // Pie Chart: Value distribution by investment type
      const typeTotals = investmentTypes.reduce((acc, type) => {
        const total = investments
          .filter((inv) => inv.type === type)
          .reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
        if (total > 0) acc[type] = total
        return acc
      }, {})

      const labels = Object.keys(typeTotals)
      const data = labels.map((type) => typeTotals[type])

      config = {
        type: "doughnut",
        data: {
          labels: labels.map((label) => label.charAt(0).toUpperCase() + label.slice(1)),
          datasets: [
            {
              data,
              backgroundColor: COLORS.slice(0, labels.length),
              borderWidth: 2,
              borderColor: "#ffffff",
              hoverBorderWidth: 3,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                  weight: "500",
                },
              },
            },
            title: {
              display: true,
              text: "Portfolio Distribution by Investment Type",
              font: {
                size: 16,
                weight: "bold",
              },
              padding: 20,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: (context) => {
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${context.label}: $${value.toLocaleString()} (${percentage}%)`
                },
              },
            },
          },
          cutout: "60%",
        },
      }
    }

    chartInstanceRef.current = new Chart(ctx, config)

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [investments, chartType])

  if (!Array.isArray(investments) || investments.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200 p-8 mb-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            {chartType === "time" ? (
              <BarChart3 className="h-8 w-8 text-slate-400" />
            ) : (
              <PieChart className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Investment Data</h3>
          <p className="text-slate-500">Add your first investment to see portfolio analytics and charts.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            {chartType === "time" ? (
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            ) : (
              <PieChart className="h-5 w-5 text-emerald-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {chartType === "time" ? "Portfolio Growth" : "Asset Allocation"}
            </h3>
            <p className="text-sm text-slate-600">
              {chartType === "time" ? "Track your portfolio value over time" : "View your investment distribution"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-slate-600">
            {investments.length} Investment{investments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="relative h-96">
        <canvas ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  )
}

InvestmentChart.propTypes = {
  investments: PropTypes.array.isRequired,
  chartType: PropTypes.oneOf(["time", "type"]).isRequired,
}

export default InvestmentChart