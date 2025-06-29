export default function TransactionSummary({ summary, categorySummary }) {
  const totalTransactions = Object.keys(categorySummary).length
  const isPositive = summary.total >= 0

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="bg-blue-50 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Transaction Summary</h3>
            <p className="text-sm text-gray-600">{totalTransactions} categories tracked</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Net Balance</div>
          <div className={`font-bold text-2xl flex items-center ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? (
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            ${Math.abs(summary.total).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">{isPositive ? "Credit Balance" : "Debit Balance"}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Spending by Category
        </h4>

        {Object.keys(categorySummary).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(categorySummary)
              .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
              .map(([category, total]) => {
                const isExpense = total < 0
                const amount = Math.abs(total)

                return (
                  <div
                    key={category}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer group"
                    title={`Total in ${category}: $${amount.toFixed(2)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {category}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${isExpense ? "bg-red-400" : "bg-emerald-400"}`}></div>
                    </div>
                    <div className={`font-bold text-lg ${isExpense ? "text-red-600" : "text-emerald-600"}`}>
                      ${amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{isExpense ? "Expense" : "Income"}</div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No spending data available</p>
            <p className="text-gray-400 text-sm mt-1">Add some transactions to see your spending breakdown</p>
          </div>
        )}
      </div>
    </div>
  )
}
