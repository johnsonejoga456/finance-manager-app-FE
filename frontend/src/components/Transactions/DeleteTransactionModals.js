"use client";

import PropTypes from "prop-types";

export default function DeleteTransactionModals({
  openedDelete,
  closeDelete,
  transactionName,
  handleDeleteTransaction,
}) {
  return (
    <>
      {/* Delete Transaction Modal */}
      {openedDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Delete Transaction</h3>
              <button onClick={closeDelete} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete the transaction: <strong>{transactionName}</strong>? This action cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                onClick={closeDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                onClick={handleDeleteTransaction}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

DeleteTransactionModals.propTypes = {
  openedDelete: PropTypes.bool.isRequired,
  closeDelete: PropTypes.func.isRequired,
  transactionName: PropTypes.string.isRequired,
  handleDeleteTransaction: PropTypes.func.isRequired,
};