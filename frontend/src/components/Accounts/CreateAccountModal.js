import PropTypes from 'prop-types';

const accountTypes = ['checking', 'savings', 'credit card', 'investment', 'loan', 'cash'];

export default function CreateAccountModal({ isOpen, onClose, form, setForm, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add Account</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Type</option>
              {accountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Balance</label>
            <input
              type="number"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Institution</label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={onSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};