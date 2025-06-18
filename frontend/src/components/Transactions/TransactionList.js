import PropTypes from 'prop-types';
import Transaction from './Transaction';

export default function TransactionList({
  transactions,
  categoryIcons,
  accounts,
  currentPage,
  setCurrentPage,
  transactionsPerPage,
  setEditTransaction,
  setEditForm,
  setDeleteTransactionId,
  openEdit,
  openDelete,
}) {
  const paginatedTransactions = Array.isArray(transactions)
    ? transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
    : [];

  return (
    <div>
      {paginatedTransactions.length > 0 ? (
        paginatedTransactions.map((t) => (
          <Transaction
            key={t._id}
            transaction={t}
            categoryIcons={categoryIcons}
            accounts={accounts}
            setEditTransaction={setEditTransaction}
            setEditForm={setEditForm}
            setDeleteTransactionId={setDeleteTransactionId}
            openEdit={openEdit}
            openDelete={openDelete}
          />
        ))
      ) : (
        <div className="text-gray-500 text-center py-4">No transactions available</div>
      )}
      {Array.isArray(transactions) && transactions.length > transactionsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  categoryIcons: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  transactionsPerPage: PropTypes.number.isRequired,
  setEditTransaction: PropTypes.func.isRequired,
  setEditForm: PropTypes.func.isRequired,
  setDeleteTransactionId: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  openDelete: PropTypes.func.isRequired,
};