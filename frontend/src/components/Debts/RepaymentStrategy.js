"use client"

export default function RepaymentStrategy({ strategies }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-emerald-50 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Repayment Strategies</h3>
            <p className="text-sm text-gray-600">Choose the best approach for your debt payoff</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debt Snowball Strategy */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-800">Debt Snowball</h4>
              <p className="text-sm text-blue-600">Pay smallest balances first</p>
            </div>
          </div>

          {strategies.snowball && strategies.snowball.length ? (
            <div className="space-y-3">
              {strategies.snowball.map((debt, index) => (
                <div key={debt.id} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">#{index + 1} Priority</span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      ${debt.balance.toLocaleString()}
                    </span>
                  </div>
                  <h5 className="font-medium text-gray-700">{debt.description}</h5>
                  <p className="text-sm text-gray-600">{debt.paymentPriority}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <svg className="w-8 h-8 mx-auto mb-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-blue-600 font-medium">No debts available</p>
              <p className="text-blue-500 text-sm">Add debts to see snowball strategy</p>
            </div>
          )}
        </div>

        {/* Debt Avalanche Strategy */}
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-800">Debt Avalanche</h4>
              <p className="text-sm text-red-600">Pay highest interest rates first</p>
            </div>
          </div>

          {strategies.avalanche && strategies.avalanche.length ? (
            <div className="space-y-3">
              {strategies.avalanche.map((debt, index) => (
                <div key={debt.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">#{index + 1} Priority</span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {debt.interestRate}% APR
                    </span>
                  </div>
                  <h5 className="font-medium text-gray-700">{debt.description}</h5>
                  <p className="text-sm text-gray-600">{debt.paymentPriority}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <svg className="w-8 h-8 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
              <p className="text-red-600 font-medium">No debts available</p>
              <p className="text-red-500 text-sm">Add debts to see avalanche strategy</p>
            </div>
          )}
        </div>
      </div>

      {/* Strategy Comparison */}
      {strategies.snowball && strategies.avalanche && strategies.snowball.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-800 mb-2">💡 Strategy Tips</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong className="text-blue-600">Snowball Method:</strong> Builds momentum and motivation through quick
              wins by eliminating smaller debts first.
            </div>
            <div>
              <strong className="text-red-600">Avalanche Method:</strong> Saves more money in interest over time by
              targeting high-interest debts first.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}