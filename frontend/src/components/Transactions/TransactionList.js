
import Transaction from './Transaction'

export default function TransactionList({
  transactions,
  categoryIcons,
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
            setEditTransaction={setEditTransaction}
            setEditForm={setEditForm}
            setDeleteTransactionId={setDeleteTransactionId}
            openEdit={openEdit}
            openDelete={openDelete}
          />
        ))
      ) : (
        <div className="text-gray-500">No transactions available</div>
      )}
      {Array.isArray(transactions) && transactions.length > transactionsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
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