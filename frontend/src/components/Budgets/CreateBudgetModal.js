import { categories } from '../../utils/budgetUtils';

export default function CreateBudgetModal({ isOpen, onClose, form, setForm, onSubmit }) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create Budget</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="category" className="block mb-1 text-sm font-semibold text-gray-700">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block mb-1 text-sm font-semibold text-gray-700">Amount</label>
            <input
              id="amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block mb-1 text-sm font-semibold text-gray-700">Currency</label>
            <select
              id="currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label htmlFor="period" className="block mb-1 text-sm font-semibold text-gray-700">Period</label>
            <select
              id="period"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {form.period === 'custom' && (
            <>
              <div>
                <label htmlFor="startDate" className="block mb-1 text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={form.customPeriod.startDate}
                  onChange={(e) => setForm({ ...form, customPeriod: { ...form.customPeriod, startDate: e.target.value } })}
                  className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block mb-1 text-sm font-semibold text-gray-700">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={form.customPeriod.endDate}
                  onChange={(e) => setForm({ ...form, customPeriod: { ...form.customPeriod, endDate: e.target.value } })}
                  className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="recurrence" className="block mb-1 text-sm font-semibold text-gray-700">Recurrence</label>
            <select
              id="recurrence"
              value={form.recurrence}
              onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label htmlFor="alertThreshold" className="block mb-1 text-sm font-semibold text-gray-700">Alert Threshold (%)</label>
            <input
              id="alertThreshold"
              type="number"
              value={form.alertThreshold}
              onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
              required
              step="1"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={onSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}