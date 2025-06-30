"use client"

export default function EditDebtModal({ isOpen, onClose, form, setForm, onSubmit }) {
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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Edit Debt</h3>
                <p className="text-blue-100 text-sm">Update debt information</p>
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
                id="editDescription"
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
                id="editCreditor"
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
                  id="editBalance"
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
                  id="editInterestRate"
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
                  id="editMinimumPayment"
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
                id="editDueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={inputClasses}
                required
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
              onClick={onSubmit}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}