
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
}) {
  return (
    <>
      {/* Add Transaction Modal */}
      {openedAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add Transaction</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTransaction({
                  ...form,
                  amount: Number(form.amount),
                  tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
                });
              }}
            >
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Type</label>
                <select
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, subType: '' })}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                  <option value="investment">Investment</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Sub Type</label>
                <select
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  value={form.subType}
                  onChange={(e) => setForm({ ...form, subType: e.target.value })}
                >
                  <option value="">Select sub type</option>
                  {(subTypes[form.type] || []).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Amount</label>
                <input
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  placeholder="e.g., 50"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Date</label>
                <input
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Notes</label>
                <input
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g., Weekly shopping"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g., personal, work"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Recurrence</label>
                <select
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  value={form.recurrence}
                  onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
                >
                  <option value="">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Currency</label>
                <input
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  placeholder="e.g., USD"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Add
                </button>
                <button type="button" className="border px-4 py-2 rounded text-gray-700" onClick={closeAdd}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {openedEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Transaction</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTransaction({ ...editTransaction, ...editForm });
              }}
            >
              <div className="mb-3">
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select
                  className="border rounded px-2 py-1 w-full bg-white text-gray-700"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button type="button" className="border px-4 py-2 rounded text-gray-700" onClick={closeEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openedDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h3>
            <div className="text-gray-700">Are you sure you want to delete this transaction?</div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleDeleteTransaction}
              >
                Confirm
              </button>
              <button className="border px-4 py-2 rounded text-gray-700" onClick={closeDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}