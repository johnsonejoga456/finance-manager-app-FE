import { types } from '../../utils/debtUtils';

export default function CreateDebtModal({ isOpen, onClose, form, setForm, onSubmit }) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Debt</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
            <input
              id="description"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="creditor" className="block mb-1 text-sm font-semibold text-gray-700">Creditor</label>
            <input
              id="creditor"
              type="text"
              value={form.creditor}
              onChange={(e) => setForm({ ...form, creditor: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="balance" className="block mb-1 text-sm font-semibold text-gray-700">Balance</label>
            <input
              id="balance"
              type="number"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block mb-1 text-sm font-semibold text-gray-700">Interest Rate (%)</label>
            <input
              id="interestRate"
              type="number"
              value={form.interestRate}
              onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="minimumPayment" className="block mb-1 text-sm font-semibold text-gray-700">Minimum Payment</label>
            <input
              id="minimumPayment"
              type="number"
              value={form.minimumPayment}
              onChange={(e) => setForm({ ...form, minimumPayment: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block mb-1 text-sm font-semibold text-gray-700">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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