import { useState, useEffect, useCallback } from 'react';
import accountService from '../services/accountService';
import TransactionsModal from '../components/Budgets/TransactionsModal';
import ErrorAlert from '../components/Budgets/ErrorAlert';
import CreateAccountModal from '../components/Accounts/CreateAccountModal';
import EditAccountModal from '../components/Accounts/EditAccountModal';
import DeleteAccountModal from '../components/Accounts/DeleteAccountModal';
import axios from 'axios';

const accountTypes = ['checking', 'savings', 'credit card', 'investment', 'loan', 'cash'];

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [openedTransactions, setOpenedTransactions] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTransactions, setLoading] = useState(false);
  const transactionsPerPage = 5; // Fixed this line

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
      const response = await accountService.getAccounts();
      const fetchedAccounts = Array.isArray(response.data.data) ? response.data.data : [];
      setAccounts(fetchedAccounts);
      setFilteredAccounts(fetchedAccounts);
      console.log('Fetched accounts:', fetchedAccounts);
      setError(null);
    } catch (err) {
      console.error('Fetch accounts error:', err.message);
      setError(err.message || 'Failed to fetch accounts');
      setAccounts([]);
      setFilteredAccounts([]);
    }
  }, []);

  const fetchTransactionsForAccount = useCallback(async (account) => {
    try {
      setLoading(true);
      const response = await accountService.getAccountTransactions(account._id);
      const fetchedTransactions = Array.isArray(response.data.data) ? response.data.data : [];
      setTransactions(fetchedTransactions);
      console.log('Fetched transactions:', fetchedTransactions);
      setCurrentPage(1);
      setOpenedTransactions(true);
      setError(null);
    } catch (err) {
      console.error('Fetch transactions error:', err.message);
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
        name: '', type: '', balance: '', currency: 'USD', institution: '', notes: '',
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
        name: '', type: '', balance: '', currency: 'USD', institution: '', notes: '',
      });
      setOpenedEdit(false);
      setEditingAccount(null);
      setError(null);
    } catch (err) {
      console.error('Error updating account:', err.message);
      setError(err.message || 'Failed to update account');
    }
  }, [editForm, editingAccount, fetchAccounts]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await accountService.deleteAccount(deleteAccountId);
      await fetchAccounts();
      setOpenedDelete(false);
      setDeleteAccountId(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting account:', err.message);
      setError(err.message || 'Failed to delete account');
    }
  }, [deleteAccountId, fetchAccounts]);

  const handleExportCSV = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'json',
      });
      const accounts = Array.isArray(response.data.data) ? response.data.data : [];
      const csvContent = [
        ['Name', 'Type', 'Balance', 'Currency', 'Institution', 'Notes'],
        ...accounts.map(acc => [
          `"${acc.name}"`,
          acc.type,
          acc.balance.toFixed(2),
          acc.currency,
          `"${acc.institution || ''}"`,
          `"${acc.notes || ''}"`,
        ]),
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'accounts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null);
    } catch (err) {
      console.error('Export accounts error:', err.message);
      setError('Failed to export accounts');
    }
  }, []);

  const handleFilterType = useCallback((type) => {
    setFilterType(type);
    if (type) {
      setFilteredAccounts(accounts.filter(acc => acc.type === type));
    } else {
      setFilteredAccounts(accounts);
    }
  }, [accounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    handleFilterType(filterType);
  }, [accounts, filterType, handleFilterType]);

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
      </div>
      {filteredAccounts.length ? (
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
        }}
        transactions={transactions}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        transactionsPerPage={transactionsPerPage}
        loading={loadingTransactions}
      />
    </div>
  );
}