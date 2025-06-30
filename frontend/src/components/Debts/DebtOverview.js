"use client"

import { useState } from "react"

export default function DebtOverview({ debtStatus, debts, onPayment, onEdit, onDelete }) {
  const [paymentForm, setPaymentForm] = useState({ amount: "", date: new Date().toISOString().split("T")[0] })
  const [paymentDebtId, setPaymentDebtId] = useState(null)

  const handlePaymentSubmit = (debtId) => {
    if (!paymentForm.amount || paymentForm.amount <= 0) return
    onPayment(debtId, Number.parseFloat(paymentForm.amount), paymentForm.date)
    setPaymentForm({ amount: "", date: new Date().toISOString().split("T")[0] })
    setPaymentDebtId(null)
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-emerald-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-amber-500"
    return "bg-red-500"
  }

  const getProgressBgColor = (progress) => {
    if (progress >= 75) return "bg-emerald-100"
    if (progress >= 50) return "bg-blue-100"
    if (progress >= 25) return "bg-amber-100"
    return "bg-red-100"
  }

  const isOverdue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  }

  const isDueSoon = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 7 && daysUntilDue > 0
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Debt Overview</h2>
              <p className="text-sm text-gray-600">{debtStatus.length} active debts</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-8">
          <button
            className="border-b-2 border-red-500 text-red-600 py-2 px-1 font-semibold text-sm"
            aria-current="page"
          >
            Overview
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 font-medium text-sm transition-colors duration-200">
            Payment History
          </button>
        </nav>
      </div>

      {/* Debt Cards */}
      <div className="p-6">
        {debtStatus.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {debtStatus.map((status) => (
              <div
                key={status.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                aria-label={`Debt card for ${status.description}`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{status.description}</h3>
                    {isOverdue(status.dueDate) && (
                      <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                        Overdue
                      </span>
                    )}
                    {isDueSoon(status.dueDate) && !isOverdue(status.dueDate) && (
                      <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                        Due Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Creditor */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Creditor:</span> {status.creditor}
                  </p>
                </div>

                {/* Financial Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Balance:</span>
                    <span className="font-bold text-red-600">${status.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interest Rate:</span>
                    <span className="font-semibold text-gray-800">{status.interestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min. Payment:</span>
                    <span className="font-semibold text-gray-800">${status.minimumPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="font-semibold text-gray-800">{new Date(status.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Repayment Progress</span>
                    <span className="text-sm font-bold text-gray-800">{status.progress.toFixed(1)}%</span>
                  </div>
                  <div className={`w-full ${getProgressBgColor(status.progress)} rounded-full h-3`}>
                    <div
                      className={`h-3 rounded-full ${getProgressColor(status.progress)} transition-all duration-300`}
                      style={{ width: `${Math.min(status.progress, 100)}%` }}
                      aria-label={`Repayment progress for ${status.description}`}
                    ></div>
                  </div>
                </div>

                {/* Payment Form or Actions */}
                {paymentDebtId === status.id ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Payment amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        onClick={() => setPaymentDebtId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        onClick={() => handlePaymentSubmit(status.id)}
                      >
                        Record Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                      onClick={() => setPaymentDebtId(status.id)}
                      aria-label={`Record payment for ${status.description}`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Payment
                    </button>

                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        onClick={() => onEdit(debts.find((d) => d._id === status.id) || {})}
                        aria-label={`Edit ${status.description} debt`}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        onClick={() => onDelete(status.id)}
                        aria-label={`Delete ${status.description} debt`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Debts Found</h4>
            <p className="text-gray-500 mb-4">Start by adding your first debt to track your repayment progress.</p>
          </div>
        )}
      </div>
    </div>
  )
}
