"use client"

import PropTypes from "prop-types"
import Transaction from "./Transaction"

export default function TransactionList({
  transactions,
  categoryIcons,
  accounts,
  currentPage,
  setCurrentPage,
  transactionsPerPage,
  totalTransactions,
  setEditTransaction,
  setEditForm,
  setDeleteTransactionId,
  openEditTransaction,
  openDeleteTransaction,
}) {
  const paginatedTransactions = Array.isArray(transactions)
    ? transactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
    : []

  const totalPages = Math.ceil(totalTransactions / transactionsPerPage)

  // Generate pagination numbers with ellipsis
  const generatePaginationNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, arr) => (arr.indexOf(item) === index && item !== 1) || index === 0)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
              <p className="text-sm text-gray-600">
                {totalTransactions} total transactions • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            Showing {paginatedTransactions.length} of {totalTransactions}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-6">
        {paginatedTransactions.length > 0 ? (
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <Transaction
                key={transaction._id}
                transaction={transaction}
                categoryIcons={categoryIcons}
                accounts={accounts}
                setEditTransaction={setEditTransaction}
                setEditForm={setEditForm}
                setDeleteTransactionId={setDeleteTransactionId}
                openEdit={openEditTransaction}
                openDelete={openDeleteTransaction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Transactions Found</h4>
            <p className="text-gray-500 mb-4">
              {totalTransactions === 0
                ? "Start by adding your first transaction to track your finances."
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalTransactions > transactionsPerPage && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * transactionsPerPage + 1} to{" "}
              {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200"
                }`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {generatePaginationNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white shadow-md"
                        : pageNum === "..."
                          ? "text-gray-400 cursor-default"
                          : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200"
                    }`}
                    onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                    disabled={pageNum === "..."}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-white hover:shadow-sm border border-gray-200"
                }`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  categoryIcons: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  transactionsPerPage: PropTypes.number.isRequired,
  totalTransactions: PropTypes.number.isRequired,
  setEditTransaction: PropTypes.func.isRequired,
  setEditForm: PropTypes.func.isRequired,
  setDeleteTransactionId: PropTypes.func.isRequired,
  openEditTransaction: PropTypes.func.isRequired,
  openDeleteTransaction: PropTypes.func.isRequired,
}
