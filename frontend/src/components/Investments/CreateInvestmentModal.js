"use client"
import PropTypes from "prop-types"
import { investmentTypes } from "../../constants/investmentTypes"
import { TrendingUp, DollarSign, Calendar, Building2, FileText, X } from "lucide-react"

const CreateInvestmentModal = ({ isOpen, onClose, form, setForm, onSubmit }) => {
  if (!isOpen) return null

  const getInvestmentIcon = (type) => {
    const icons = {
      stock: "📈",
      bond: "🏛️",
      "mutual fund": "📊",
      ETF: "🔄",
      "real estate": "🏠",
      crypto: "₿",
      commodity: "🥇",
      "index fund": "📋",
    }
    return icons[type] || "💼"
  }

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "C$",
      AUD: "A$",
    }
    return symbols[currency] || "$"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Add Investment</h2>
                <p className="text-emerald-100">Create a new investment entry</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Investment Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Investment Name *</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., Apple Inc. (AAPL)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Investment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Investment Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Select Type</option>
                {investmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {getInvestmentIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Currency *</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Select Currency</option>
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
                <option value="GBP">🇬🇧 GBP - British Pound</option>
                <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
              </select>
            </div>

            {/* Initial Investment */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Investment *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.initialInvestment}
                  onChange={(e) => setForm({ ...form, initialInvestment: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                {form.currency && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                    {getCurrencySymbol(form.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Current Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Value *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.currentValue}
                  onChange={(e) => setForm({ ...form, currentValue: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                {form.currency && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                    {getCurrencySymbol(form.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Institution</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., Fidelity, Charles Schwab"
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <textarea
                  placeholder="Additional notes about this investment..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Performance Preview */}
          {form.initialInvestment && form.currentValue && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-semibold text-slate-700 mb-2">Performance Preview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Gain/Loss</p>
                  <p
                    className={`font-bold ${
                      (Number.parseFloat(form.currentValue) - Number.parseFloat(form.initialInvestment)) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {getCurrencySymbol(form.currency || "USD")}
                    {(Number.parseFloat(form.currentValue) - Number.parseFloat(form.initialInvestment)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Return %</p>
                  <p
                    className={`font-bold ${
                      (
                        ((Number.parseFloat(form.currentValue) - Number.parseFloat(form.initialInvestment)) /
                          Number.parseFloat(form.initialInvestment)) *
                          100
                      ) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {(
                      ((Number.parseFloat(form.currentValue) - Number.parseFloat(form.initialInvestment)) /
                        Number.parseFloat(form.initialInvestment)) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium shadow-lg"
            >
              Add Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

CreateInvestmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default CreateInvestmentModal