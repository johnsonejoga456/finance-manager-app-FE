import { useState } from 'react';

export default function DebtOverview({ debtStatus, debts, onPayment, onEdit, onDelete }) {
  const [paymentForm, setPaymentForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0] });
  const [paymentDebtId, setPaymentDebtId] = useState(null);

  const handlePaymentSubmit = (debtId) => {
    if (!paymentForm.amount || paymentForm.amount <= 0) return;
    onPayment(debtId, parseFloat(paymentForm.amount), paymentForm.date);
    setPaymentForm({ amount: '', date: new Date().toISOString().split('T')[0] });
    setPaymentDebtId(null);
  };

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 font-medium" aria-current="page">
            Overview
          </button>
        </nav>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {debtStatus.length ? debtStatus.map(status => (
            <div
              key={status.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              aria-label={`Debt card for ${status.description}`}
            >
              <h3 className="text-lg font-semibold text-gray-800">{status.description}</h3>
              <p className="text-sm text-gray-500">Creditor: {status.creditor}</p>
              <p className="text-gray-600">Balance: ${status.balance.toFixed(2)}</p>
              <p className="text-gray-600">Interest Rate: {status.interestRate}%</p>
              <p className="text-gray-600">Minimum Payment: ${status.minimumPayment.toFixed(2)}</p>
              <p className="text-gray-600">Due Date: {new Date(status.dueDate).toLocaleDateString()}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-green-600"
                    style={{ width: `${Math.min(status.progress, 100)}%` }}
                    aria-label={`Repayment progress for ${status.description}`}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{status.progress.toFixed(0)}% Paid</p>
              </div>
              {paymentDebtId === status.id ? (
                <div className="mt-4">
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    placeholder="Payment amount"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                      onClick={() => setPaymentDebtId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                      onClick={() => handlePaymentSubmit(status.id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-between">
                  <button
                    className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                    onClick={() => setPaymentDebtId(status.id)}
                    aria-label={`Record payment for ${status.description}`}
                  >
                    Record Payment
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                      onClick={() => onEdit(debts.find(d => d._id === status.id) || {})}
                      aria-label={`Edit ${status.description} debt`}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 p-2 rounded"
                      onClick={() => onDelete(status.id)}
                      aria-label={`Delete ${status.description} debt`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="col-span-3 text-center text-gray-500">No debts found</div>
          )}
        </div>
      </div>
    </div>
  );
}