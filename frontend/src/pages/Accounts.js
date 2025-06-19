import { useState, useEffect, useCallback } from 'react';
import accountService from '../services/accountService';
import TransactionsModal from '../components/Transactions/TransactionModals';
import ErrorAlert from '../components/Budgets/ErrorAlert';
import CreateAccountModal from '../components/Accounts/CreateAccountModal';
import EditAccountModal from '../components/Accounts/EditAccountModal';
import DeleteAccountModal from '../components/Accounts/DeleteAccountModal';

const accountTypes = ['checking', 'savings', 'credit card', 'investment', 'loan', 'cash'];

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [error, setError] = useState(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [openedTransactions, setOpenedTransactions] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [loadingTransactions, setLoading] = useState(false);
  const accountsPerPage = 10;
  const transactionsPerPage = 5;

  const [form, setForm] = useState({
    name: '',
    type: '',
    balance: '',
    currency: 'USD',
    institution: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    balance: '',
    currency: 'USD',
    institution: '',
    notes: '',
  });

  const fetchAccounts = useCallback(async () => {
    try {
      const { accounts, total } = await accountService.getAccounts({
        page: currentAccountPage,
        limit: accountsPerPage,
      });
      setAccounts(accounts || []);
      setFilteredAccounts(accounts || []); // Ensure array
      setTotalAccounts(total || 0);
      console.log('Fetched accounts:', accounts);
      setError(null);
    } catch (err) {
      console.error('Fetch accounts error:', err.message);
      setError(err.message || 'Failed to fetch accounts');
      setAccounts([]);
      setFilteredAccounts([]);
      setTotalAccounts(0);
    }
  }, [currentAccountPage]);

  const fetchTransactionsForAccount = useCallback(async (account) => {
    try {
      setLoading(true);
      const { transactions, total } = await accountService.getAccountTransactions(account._id, {
        page: currentTransactionPage,
        limit: transactionsPerPage,
      });
      setTransactions(transactions || []);
      setTotalTransactions(total || 0);
      setSelectedAccountId(account._id);
      console.log('Fetched transactions:', transactions);
      setOpenedTransactions(true);
      setError(null);
    } catch (err) {
      console.error('Fetch transactions error:', err.message);
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]);
      setTotalTransactions(0);
    } finally {
      setLoading(false);
    }
  }, [currentTransactionPage]);

  const handleCreateAccount = useCallback(async () => {
    if (!form.name || !form.type || !form.balance || !form.currency) {
      setError('All required fields must be filled');
      return;
    }
    try {
      await accountService.addAccount({
        ...form,
        balance: parseFloat(form.balance),
      });
      await fetchAccounts();
      setForm({
        name: '',
        type: '',
        balance: '',
        currency: 'USD',
        institution: '',
        notes: '',
      });
      setOpenedCreate(false);
      setError(null);
    } catch (err) {
      console.error('Create account error:', err.message);
      setError(err.message || 'Failed to create account');
    }
  }, [form, fetchAccounts]);

  const handleEditAccount = useCallback(async () => {
    if (!editForm.name || !editForm.type || !editForm.balance || !editForm.currency) {
      setError('All required fields must be filled');
      return;
    }
    try {
      await accountService.updateAccount(editingAccount._id, {
        ...editForm,
        balance: parseFloat(editForm.balance),
      });
      await fetchAccounts();
      setEditForm({
        name: '',
        type: '',
        balance: '',
        currency: 'USD',
        institution: '',
        notes: '',
      });
      setOpenedEdit(false);
      setEditingAccount(null);
      setError(null);
    } catch (err) {
      console.error('Error updating account:', err.message);
      setError(err.message || 'Failed to update account');
    }
  }, [editForm, editingAccount, fetchAccounts]);

  const handleDeleteAccount = useCallback(async (cascade) => {
    try {
      await accountService.deleteAccount(deleteAccountId, cascade);
      await fetchAccounts();
      setOpenedDelete(false);
      setDeleteAccountId(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting account:', err.message);
      setError(err.message || 'Failed to delete account');
    }
  }, [deleteAccountId, fetchAccounts]);

  const handleUpdateBalance = useCallback(async (accountId) => {
    try {
      await accountService.updateBalance(accountId);
      await fetchAccounts();
      if (openedTransactions && selectedAccountId === accountId) {
        await fetchTransactionsForAccount({ _id: accountId });
      }
      setError(null);
    } catch (err) {
      console.error('Update balance error:', err.message);
      setError(err.message || 'Failed to update balance');
    }
  }, [openedTransactions, selectedAccountId, fetchAccounts, fetchTransactionsForAccount]);

  const handleExportCSV = useCallback(async () => {
    try {
      await accountService.exportToCSV();
      setError(null);
    } catch (err) {
      console.error('Export accounts error:', err.message);
      setError(err.message || 'Failed to export accounts');
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    try {
      await accountService.exportToPDF();
      setError(null);
    } catch (err) {
      console.error('Export PDF error:', err.message);
      setError(err.message || 'Failed to export PDF');
    }
  }, []);

  const handleFilterType = useCallback((type) => {
    setFilterType(type);
    if (type && Array.isArray(accounts)) { // Add safety check
      setFilteredAccounts(accounts.filter(acc => acc.type === type));
    } else {
      setFilteredAccounts(accounts || []); // Ensure array
    }
  }, [accounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    handleFilterType(filterType);
  }, [accounts, filterType, handleFilterType]);

  const totalAccountPages = Math.ceil(totalAccounts / accountsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Accounts</h2>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => setOpenedCreate(true)}
        >
          Add Account
        </button>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => handleFilterType(e.target.value)}
          aria-label="Filter by account type"
        >
          <option value="">All Types</option>
          {accountTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>
      </div>
      {Array.isArray(filteredAccounts) && filteredAccounts.length ? ( // Add safety check
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map(account => (
                <tr key={account._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${account.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.institution || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => fetchTransactionsForAccount(account)}
                    >
                      Transactions
                    </button>
                    <button
                      className="text-green-600 hover:text-green-700 mr-2"
                      onClick={() => handleUpdateBalance(account._id)}
                    >
                      Update Balance
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-800 mr-2"
                      onClick={() => {
                        setEditingAccount(account);
                        setEditForm({
                          name: account.name,
                          type: account.type,
                          balance: account.balance.toString(),
                          currency: account.currency,
                          institution: account.institution || '',
                          notes: account.notes || '',
                        });
                        setOpenedEdit(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteAccountId(account._id);
                        setOpenedDelete(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentAccountPage(prev => Math.max(prev - 1, 1))}
              disabled={currentAccountPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentAccountPage} of {totalAccountPages}
            </span>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentAccountPage(prev => Math.min(prev + 1, totalAccountPages))}
              disabled={currentAccountPage === totalAccountPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No accounts found</p>
      )}
      <CreateAccountModal
        isOpen={openedCreate}
        onClose={() => setOpenedCreate(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateAccount}
      />
      <EditAccountModal
        isOpen={openedEdit}
        onClose={() => setOpenedEdit(false)}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditAccount}
      />
      <DeleteAccountModal
        isOpen={openedDelete}
        onClose={() => setOpenedDelete(false)}
        onConfirm={handleDeleteAccount}
      />
      <TransactionsModal
        isOpen={openedTransactions}
        onClose={() => {
          setOpenedTransactions(false);
          setTransactions([]);
          setTotalTransactions(0);
        }}
        transactions={transactions}
        totalTransactions={totalTransactions}
        currentPage={currentTransactionPage}
        setCurrentPage={setCurrentTransactionPage}
        transactionsPerPage={transactionsPerPage}
        loading={loadingTransactions}
        accountId={selectedAccountId}
      />
    </div>
  );
}