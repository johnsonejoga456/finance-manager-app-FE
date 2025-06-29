"use client"

import PropTypes from "prop-types"

export default function Transaction({
  transaction,
  categoryIcons,
  accounts,
  setEditTransaction,
  setEditForm,
  setDeleteTransactionId,
  openEdit,
  openDelete,
}) {
  const accountName = accounts.find((acc) => acc._id === transaction.account)?.name || "-"

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-5 mb-4 hover:shadow-md transition-all duration-200 hover:border-gray-200">
      <div className="flex items-center">
        {/* Category Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
          <span className="text-xl text-blue-600">{categoryIcons[transaction.category] || "💼"}</span>
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <h4 className="font-semibold text-gray-800 text-base truncate">{transaction.category}</h4>
              <button
                className="ml-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full p-1.5 transition-colors duration-150"
                onClick={() => {
                  setEditTransaction(transaction)
                  setEditForm({
                    type: transaction.type,
                    subType: transaction.subType || "",
                    amount: transaction.amount.toString(),
                    category: transaction.category,
                    date: new Date(transaction.date).toISOString().split("T")[0],
                    account: transaction.account || "",
                    notes: transaction.notes || "",
                    tags: transaction.tags ? transaction.tags.join(", ") : "",
                    recurrence: transaction.recurrence || "",
                    currency: transaction.currency || "USD",
                  })
                  openEdit()
                }}
                title="Edit transaction"
                type="button"
                aria-label="Edit transaction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div className="flex items-center">
              <span
                className={`font-bold text-lg ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : transaction.type === "expense"
                      ? "text-red-500"
                      : "text-gray-600"
                }`}
              >
                {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}$
                {transaction.amount.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm ml-1">{transaction.currency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="truncate max-w-xs">{transaction.notes || "No notes"}</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-700">{accountName}</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-500 font-medium">
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <button
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors duration-150"
                onClick={() => {
                  setDeleteTransactionId(transaction._id)
                  openDelete()
                }}
                title="Delete transaction"
                type="button"
                aria-label="Delete transaction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Transaction.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    subType: PropTypes.string,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    account: PropTypes.string,
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    recurrence: PropTypes.string,
    currency: PropTypes.string,
  }).isRequired,
  categoryIcons: PropTypes.object.isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setEditTransaction: PropTypes.func.isRequired,
  setEditForm: PropTypes.func.isRequired,
  setDeleteTransactionId: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  openDelete: PropTypes.func.isRequired,
}
