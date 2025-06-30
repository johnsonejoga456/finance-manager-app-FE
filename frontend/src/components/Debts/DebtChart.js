"use client"

import { Line } from "react-chartjs-2"
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from "chart.js"
import "chartjs-adapter-date-fns"

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend)

export default function DebtChart({ debts }) {
  const data = {
    datasets: [
      {
        label: "Total Debt Balance",
        data: debts.flatMap((d) => [
          { x: d.createdAt, y: d.initialBalance || d.balance },
          ...d.paymentHistory.map((p) => ({ x: p.date, y: d.balance + p.amount })),
          { x: new Date(), y: d.balance },
        ]),
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#FF5722",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
            const value = context.parsed.y
            return `Total Debt: $${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "month" },
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
          callback: (value) => `$${value.toLocaleString()}`,
        },
        title: {
          display: true,
          text: "Amount ($)",
          color: "#374151",
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-red-50 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Debt Trends</h3>
            <p className="text-sm text-gray-600">Track your debt reduction progress over time</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {debts.length} {debts.length === 1 ? "Debt" : "Debts"}
        </div>
      </div>

      {debts.length ? (
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Debt Data Available</h4>
          <p className="text-gray-500">Add some debts to see your repayment trends and progress.</p>
        </div>
      )}
    </div>
  )
}
