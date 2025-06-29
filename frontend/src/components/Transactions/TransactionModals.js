"use client"

import PropTypes from "prop-types"

const currencies = ["USD", "EUR", "GBP"]

export default function TransactionModals({
  openedAdd,
  closeAdd,
  openedEdit,
  closeEdit,
  openedDelete,
  closeDelete,
  form,
  setForm,
  editForm,
  setEditForm,
  editTransaction,
  handleAddTransaction,
  handleEditTransaction,
  handleDeleteTransaction,
  categories,
  subTypes,
  accounts,
}) {
  const validateTags = (tagsString) => {
    return tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }

  const FormField = ({ label, children, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )

  const inputClasses =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

  return (
    <>
      {/* Add Transaction Modal */}
      {openedAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add New Transaction</h3>
                    <p className="text-emerald-100 text-sm">Record your income, expense, or transfer</p>
                  </div>
                </div>
                <button
                  onClick={closeAdd}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const tags = validateTags(form.tags)
                  if (!tags.length && form.tags) {
                    alert("Please enter valid tags or leave empty")
                    return
                  }
                  handleAddTransaction({
                    ...form,
                    amount: Number(form.amount),
                    tags,
                  })
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
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

                <FormField label="Sub Type">
                  <select
                    className={inputClasses}
                    value={form.subType}
                    onChange={(e) => setForm({ ...form, subType: e.target.value })}
                  >
                    <option value="">Select sub type</option>
                    {(subTypes[form.type] || []).map((st) => (
                      <option key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Category" required>
                  <select
                    className={inputClasses}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>

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

                <FormField label="Date" required>
                  <input
                    className={inputClasses}
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </FormField>

                <FormField label="Account">
                  <select
                    className={inputClasses}
                    value={form.account}
                    onChange={(e) => setForm({ ...form, account: e.target.value })}
                  >
                    <option value="">No Account</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </FormField>

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

                <div className="md:col-span-2">
                  <FormField label="Tags">
                    <input
                      className={inputClasses}
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="personal, work, urgent (comma-separated)"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
                    onClick={closeAdd}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {openedEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
                    <h3 className="text-xl font-bold text-white">Edit Transaction</h3>
                    <p className="text-blue-100 text-sm">Update transaction details</p>
                  </div>
                </div>
                <button
                  onClick={closeEdit}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Similar structure to Add Modal but with editForm */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const tags = validateTags(editForm.tags)
                  if (!tags.length && editForm.tags) {
                    alert("Please enter valid tags or leave empty")
                    return
                  }
                  handleEditTransaction({
                    ...editTransaction,
                    ...editForm,
                    amount: Number(editForm.amount),
                    tags,
                  })
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Same form fields as Add Modal but using editForm */}
                <FormField label="Transaction Type" required>
                  <select
                    className={inputClasses}
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value, subType: "" })}
                    required
                  >
                    <option value="income">💰 Income</option>
                    <option value="expense">💸 Expense</option>
                    <option value="transfer">🔄 Transfer</option>
                    <option value="investment">📈 Investment</option>
                  </select>
                </FormField>

                <FormField label="Sub Type">
                  <select
                    className={inputClasses}
                    value={editForm.subType}
                    onChange={(e) => setEditForm({ ...editForm, subType: e.target.value })}
                  >
                    <option value="">Select sub type</option>
                    {(subTypes[editForm.type] || []).map((st) => (
                      <option key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Category" required>
                  <select
                    className={inputClasses}
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Amount" required>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                    <input
                      className={`${inputClasses} pl-8`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </FormField>

                <FormField label="Date" required>
                  <input
                    className={inputClasses}
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                  />
                </FormField>

                <FormField label="Account">
                  <select
                    className={inputClasses}
                    value={editForm.account}
                    onChange={(e) => setEditForm({ ...editForm, account: e.target.value })}
                  >
                    <option value="">No Account</option>
                    {accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Currency" required>
                  <select
                    className={inputClasses}
                    value={editForm.currency}
                    onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
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

                <FormField label="Recurrence">
                  <select
                    className={inputClasses}
                    value={editForm.recurrence}
                    onChange={(e) => setEditForm({ ...editForm, recurrence: e.target.value })}
                  >
                    <option value="">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Notes">
                    <textarea
                      className={`${inputClasses} resize-none`}
                      rows="3"
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Add any additional details..."
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Tags">
                    <input
                      className={inputClasses}
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      placeholder="personal, work, urgent (comma-separated)"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
                    onClick={closeEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openedDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Transaction</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
                  onClick={closeDelete}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                  onClick={handleDeleteTransaction}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

TransactionModals.propTypes = {
  openedAdd: PropTypes.bool.isRequired,
  closeAdd: PropTypes.func.isRequired,
  openedEdit: PropTypes.bool.isRequired,
  closeEdit: PropTypes.func.isRequired,
  openedDelete: PropTypes.bool.isRequired,
  closeDelete: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  editForm: PropTypes.object.isRequired,
  setEditForm: PropTypes.func.isRequired,
  editTransaction: PropTypes.object,
  handleAddTransaction: PropTypes.func.isRequired,
  handleEditTransaction: PropTypes.func.isRequired,
  handleDeleteTransaction: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  subTypes: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
}