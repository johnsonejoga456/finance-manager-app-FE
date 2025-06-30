"use client"
import PropTypes from "prop-types"
import { AlertTriangle, X, TrendingDown } from "lucide-react"

const DeleteInvestmentModal = ({ isOpen, onClose, onConfirm, investmentName }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delete Investment</h2>
                <p className="text-red-100">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <TrendingDown className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Permanent Deletion</h4>
                <p className="text-red-700 text-sm">
                  This will permanently delete the investment and all associated data. This action cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          <p className="text-slate-700 mb-2">Are you sure you want to delete this investment?</p>

          {investmentName && (
            <div className="bg-slate-100 rounded-lg p-3 mb-6">
              <p className="font-semibold text-slate-800">{investmentName}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-lg"
            >
              Delete Investment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

DeleteInvestmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  investmentName: PropTypes.string,
}

export default DeleteInvestmentModal