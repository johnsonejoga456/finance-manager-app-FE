export default function BudgetOverview({ budgetStatus, budgets, onViewTransactions, onEdit, onDelete }) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 font-medium"
            aria-current="page"
          >
            Overview
          </button>
          <button
            className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 font-medium"
          >
            Insights
          </button>
        </nav>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetStatus.length ? budgetStatus.map(status => (
            <div
              key={status.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              aria-label={`Budget card for ${status.category}`}
            >
              <h3 className="text-lg font-semibold text-gray-800">{status.category}</h3>
              <p className="text-sm text-gray-500">
                {new Date(status.periodDates.startDate).toLocaleDateString()} -{' '}
                {new Date(status.periodDates.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Budgeted: ${status.budgeted.toFixed(2)}</p>
              <p className="text-gray-600">Spent: ${status.spent.toFixed(2)}</p>
              <p className={`text-${status.remaining >= 0 ? 'green' : 'red'}-600`}>
                Remaining: ${status.remaining.toFixed(2)}
              </p>
              {status.alertTriggered && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mt-2 text-sm" role="alert">
                  Spending at {status.percentage.toFixed(0)}% of budget!
                </div>
              )}
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${status.percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                    aria-label={`Spending progress for ${status.category}`}
                  ></div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                  onClick={() => onViewTransactions(status)}
                  aria-label={`View transactions for ${status.category}`}
                >
                  View Transactions
                </button>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                    onClick={() => onEdit(budgets.find(b => b._id === status.id) || {})}
                    aria-label={`Edit ${status.category} budget`}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:bg-red-100 p-2 rounded"
                    onClick={() => onDelete(status.id)}
                    aria-label={`Delete ${status.category} budget`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-gray-500">No budgets found</div>
          )}
        </div>
      </div>
    </div>
  );
}