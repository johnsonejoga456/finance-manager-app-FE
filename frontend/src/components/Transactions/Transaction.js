
export default function Transaction({ transaction, categoryIcons, setEditTransaction, setEditForm, setDeleteTransactionId, openEdit, openDelete }) {
  return (
    <div className="bg-white shadow-sm rounded-md border p-4 mb-4 flex items-center">
      <span className="w-10 text-center text-2xl">{categoryIcons[transaction.category] || '🔧'}</span>
      <div className="flex-1 ml-4">
        <div className="font-semibold flex items-center text-gray-800">
          {transaction.category}
          <button
            className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => {
              setEditTransaction(transaction);
              setEditForm({ category: transaction.category });
              openEdit();
            }}
            title="Edit"
            type="button"
          >
            ✏️
          </button>
        </div>
        <div className="text-gray-500 text-sm">{transaction.notes || '-'}</div>
      </div>
      <span className={`mr-4 font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        ${transaction.amount.toFixed(2)} {transaction.currency}
      </span>
      <span className="mr-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</span>
      <button
        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center"
        onClick={() => {
          setDeleteTransactionId(transaction._id);
          openDelete();
        }}
        title="Delete"
        type="button"
      >
        −
      </button>
    </div>
  );
}