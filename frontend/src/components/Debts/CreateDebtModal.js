"use client"

export default function CreateDebtModal({ isOpen, onClose, form, setForm, onSubmit }) {
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
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
                <h3 className="text-xl font-bold text-white">Add New Debt</h3>
                <p className="text-red-100 text-sm">Track your debt obligations</p>
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
            <FormField label="Debt Description" required>
              <input
                id="description"
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClasses}
                placeholder="e.g., Credit Card, Student Loan, Mortgage"
                required
              />
            </FormField>

            <FormField label="Creditor/Lender" required>
              <input
                id="creditor"
                type="text"
                value={form.creditor}
                onChange={(e) => setForm({ ...form, creditor: e.target.value })}
                className={inputClasses}
                placeholder="e.g., Chase Bank, Wells Fargo"
                required
              />
            </FormField>

            <FormField label="Current Balance" required>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                <input
                  id="balance"
                  type="number"
                  value={form.balance}
                  onChange={(e) => setForm({ ...form, balance: e.target.value })}
                  className={`${inputClasses} pl-8`}
                  placeholder="0.00"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
            </FormField>

            <FormField label="Interest Rate" required>
              <div className="relative">
                <input
                  id="interestRate"
                  type="number"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                  className={`${inputClasses} pr-8`}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-4 top-3.5 text-gray-500 font-medium">%</span>
              </div>
            </FormField>

            <FormField label="Minimum Payment" required>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                <input
                  id="minimumPayment"
                  type="number"
                  value={form.minimumPayment}
                  onChange={(e) => setForm({ ...form, minimumPayment: e.target.value })}
                  className={`${inputClasses} pl-8`}
                  placeholder="0.00"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
            </FormField>

            <FormField label="Next Due Date" required>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={inputClasses}
                required
                min={new Date().toISOString().split("T")[0]}
              />
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
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
              onClick={onSubmit}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Debt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
