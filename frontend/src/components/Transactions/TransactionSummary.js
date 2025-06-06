export default function TransactionSummary({ summary, categorySummary }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <span className="text-gray-600 font-medium">Transactions: {Object.keys(categorySummary).length}</span>
        <span className={`font-semibold text-lg ${summary.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
          Total: ${Math.abs(summary.total).toFixed(2)} {summary.total < 0 ? 'Debit' : 'Credit'}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Spending by Category</h4>
      {Object.keys(categorySummary).length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(categorySummary).map(([category, total]) => (
            <div
              key={category}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title={`Total spent in ${category}: $${total.toFixed(2)}`}
            >
              <div className="font-medium truncate">{category}</div>
              <div className="text-gray-900 font-semibold">${total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic">No spending data available.</div>
      )}
    </div>
  );
}