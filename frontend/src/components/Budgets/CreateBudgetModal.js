"use client"

import { categories } from "../../utils/budgetUtils"

export default function CreateBudgetModal({ isOpen, onClose, form, setForm, onSubmit }) {
  const inputClasses =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

  const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create New Budget</h3>
                <p className="text-emerald-100 text-sm">Set spending limits for your categories</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Category" required>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClasses}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Budget Amount" required>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                <input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={`${inputClasses} pl-8`}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </FormField>

            <FormField label="Currency" required>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className={inputClasses}
              >
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
                <option value="GBP">🇬🇧 GBP - British Pound</option>
              </select>
            </FormField>

            <FormField label="Budget Period" required>
              <select
                id="period"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className={inputClasses}
                required
              >
                <option value="weekly">📅 Weekly</option>
                <option value="monthly">🗓️ Monthly</option>
                <option value="yearly">📆 Yearly</option>
                <option value="custom">⚙️ Custom Period</option>
              </select>
            </FormField>

            {form.period === "custom" && (
              <>
                <FormField label="Start Date" required>
                  <input
                    id="startDate"
                    type="date"
                    value={form.customPeriod.startDate}
                    onChange={(e) =>
                      setForm({ ...form, customPeriod: { ...form.customPeriod, startDate: e.target.value } })
                    }
                    className={inputClasses}
                    required
                  />
                </FormField>

                <FormField label="End Date" required>
                  <input
                    id="endDate"
                    type="date"
                    value={form.customPeriod.endDate}
                    onChange={(e) =>
                      setForm({ ...form, customPeriod: { ...form.customPeriod, endDate: e.target.value } })
                    }
                    className={inputClasses}
                    required
                  />
                </FormField>
              </>
            )}

            <FormField label="Recurrence">
              <select
                id="recurrence"
                value={form.recurrence}
                onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
                className={inputClasses}
              >
                <option value="none">🚫 None</option>
                <option value="daily">📅 Daily</option>
                <option value="weekly">🗓️ Weekly</option>
                <option value="monthly">📆 Monthly</option>
              </select>
            </FormField>

            <FormField label="Alert Threshold" required>
              <div className="relative">
                <input
                  id="alertThreshold"
                  type="number"
                  value={form.alertThreshold}
                  onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })}
                  className={`${inputClasses} pr-8`}
                  min="0"
                  max="100"
                  required
                  step="1"
                  placeholder="80"
                />
                <span className="absolute right-4 top-3.5 text-gray-500 font-medium">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Get alerts when spending reaches this percentage</p>
            </FormField>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
              onClick={onSubmit}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
