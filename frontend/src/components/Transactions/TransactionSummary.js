
export default function TransactionSummary({ summary, categorySummary }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700">Transactions: {Object.keys(categorySummary).length}</span>
        <span className={`font-semibold ${summary.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
          Total: ${summary.total.toFixed(2)}
        </span>
      </div>
      <h4 className="text-lg font-semibold mb-2 text-gray-800">Spending by Category</h4>
      {Object.keys(categorySummary).length > 0 ? (
        <div className="flex flex-wrap gap-4 mb-4">
          {Object.entries(categorySummary).map(([category, total]) => (
            <span key={category} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
              {category}: ${total.toFixed(2)}
            </span>
          ))}
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No spending data available.</div>
      )}
    </div>
  );
}