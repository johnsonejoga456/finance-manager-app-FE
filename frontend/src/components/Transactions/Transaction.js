import PropTypes from 'prop-types';

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
  const accountName = accounts.find(acc => acc._id === transaction.account)?.name || '-';

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
              setEditForm({
                type: transaction.type,
                subType: transaction.subType || '',
                amount: transaction.amount.toString(),
                category: transaction.category,
                date: new Date(transaction.date).toISOString().split('T')[0],
                account: transaction.account || '',
                notes: transaction.notes || '',
                tags: transaction.tags ? transaction.tags.join(', ') : '',
                recurrence: transaction.recurrence || '',
                currency: transaction.currency || 'USD',
              });
              openEdit();
            }}
            title="Edit"
            type="button"
          >
            ✏️
          </button>
        </div>
        <div className="text-gray-500 text-sm">
          {transaction.notes || '-'} | Account: {accountName}
        </div>
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
    })
  ).isRequired,
  setEditTransaction: PropTypes.func.isRequired,
  setEditForm: PropTypes.func.isRequired,
  setDeleteTransactionId: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  openDelete: PropTypes.func.isRequired,
};