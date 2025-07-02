"use client";

import PropTypes from "prop-types";

const currencies = ["USD", "EUR", "GBP"];

export default function EditTransactionModals({
  openedEdit,
  closeEdit,
  form,
  setForm,
  handleEditTransaction,
  categories,
  subTypes,
  accounts,
}) {
  const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClasses =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSubTypes = subTypes && typeof subTypes === "object" ? subTypes : {};

  return (
    <>
      {/* Edit Transaction Modal */}
      {openedEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Edit Transaction</h3>
                  <p className="text-emerald-100 text-sm">Modify your transaction details</p>
                </div>
              </div>
              <button onClick={closeEdit} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditTransaction({
                    ...form,
                    amount: Number(form.amount),
                  });
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Transaction Type */}
                <FormField label="Transaction Type" required>
                  <select
                    className={inputClasses}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value, subType: "" })}
                    required
                  >
                    <option value="income">💰 Income</option>
                    <option value="expense">💸 Expense</option>
                    <option value="transfer">🔄 Transfer</option>
                    <option value="investment">📈 Investment</option>
                  </select>
                </FormField>

                {/* Sub Type */}
                <FormField label="Sub Type">
                  <select
                    className={inputClasses}
                    value={form.subType}
                    onChange={(e) => setForm({ ...form, subType: e.target.value })}
                  >
                    <option value="">Select sub type</option>
                    {(safeSubTypes[form.type] || []).map((st) => (
                      <option key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Category */}
                <FormField label="Category" required>
                  <select
                    className={inputClasses}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {safeCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Amount */}
                <FormField label="Amount" required>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                    <input
                      className={`${inputClasses} pl-8`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </FormField>

                {/* Date */}
                <FormField label="Date" required>
                  <input
                    className={inputClasses}
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </FormField>

                {/* Account */}
                <FormField label="Account">
                  <select
                    className={inputClasses}
                    value={form.account}
                    onChange={(e) => setForm({ ...form, account: e.target.value })}
                  >
                    <option value="">No Account</option>
                    {safeAccounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Currency */}
                <FormField label="Currency" required>
                  <select
                    className={inputClasses}
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    required
                  >
                    <option value="">Select Currency</option>
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* Recurrence */}
                <FormField label="Recurrence">
                  <select
                    className={inputClasses}
                    value={form.recurrence}
                    onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
                  >
                    <option value="">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </FormField>

                {/* Notes */}
                <div className="md:col-span-2">
                  <FormField label="Notes">
                    <textarea
                      className={`${inputClasses} resize-none`}
                      rows="3"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Add any additional details..."
                    />
                  </FormField>
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                    onClick={closeEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

EditTransactionModals.propTypes = {
  openedEdit: PropTypes.bool.isRequired,
  closeEdit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  handleEditTransaction: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  subTypes: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};