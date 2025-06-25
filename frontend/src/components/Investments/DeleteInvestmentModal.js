import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

const DeleteInvestmentModal = ({ isOpen, onClose, onConfirm, investmentName }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg shadow-xl max-w-sm mx-auto w-full p-6 z-10">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Confirm Deletion
          </Dialog.Title>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-medium text-red-600">{investmentName || 'this investment'}</span>?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

DeleteInvestmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  investmentName: PropTypes.string,
};

export default DeleteInvestmentModal;
