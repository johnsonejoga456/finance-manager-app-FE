import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionModals from '../components/Transactions/TransactionModals';
import TransactionSummary from '../components/Transactions/TransactionSummary';
import SpendingAlerts from '../components/Transactions/SpendingAlerts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBeer, faFilm, faGasPump, faUtensils, faCreditCard, faShoppingBag, faGift, faCog } from '@fortawesome/free-solid-svg-icons';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [spendingAlerts, setSpendingAlerts] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
  const [categorySummary, setCategorySummary] = useState({});
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterNotes, setFilterNotes] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [openedAdd, setOpenedAdd] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const categories = ['Bar', 'Entertainment', 'Fuel', 'Shoes/Clothing', 'Credit Card', 'Eating Out', 'Technology', 'Gifts', 'Other'];
  const subTypes = {
    income: ['salary', 'bonus', 'freelance', 'gift', 'refund'],
    expense: ['groceries', 'rent', 'utilities', 'subscription'],
    transfer: ['savings'],
    investment: ['stocks', 'bonds'],
  };

  const categoryIcons = {
    Bar: <FontAwesomeIcon icon={faBeer} className="h-6 w-6 text-blue-500" />,
    Entertainment: <FontAwesomeIcon icon={faFilm} className="h-6 w-6 text-blue-500" />,
    Fuel: <FontAwesomeIcon icon={faGasPump} className="h-6 w-6 text-blue-500" />,
    'Shoes/Clothing': <FontAwesomeIcon icon={faShoppingBag} className="h-6 w-6 text-blue-500" />,
    'Credit Card': <FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-blue-500" />,
    'Eating Out': <FontAwesomeIcon icon={faUtensils} className="h-6 w-6 text-blue-500" />,
    Technology: <FontAwesomeIcon icon={faCog} className="h-6 w-6 text-blue-500" />,
    Gifts: <FontAwesomeIcon icon={faGift} className="h-6 w-6 text-blue-500" />,
    Other: <FontAwesomeIcon icon={faCog} className="h-6 w-6 text-blue-500" />,
  };

  const [form, setForm] = useState({
    type: 'expense',
    subType: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    tags: '',
    recurrence: '',
    currency: 'USD',
  });

  const [editForm, setEditForm] = useState({
    category: '',
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterNotes) params.query = filterNotes;
      if (filterType) params.type = filterType;
      if (filterTags) params.tags = filterTags;

      const response = await transactionService.getTransactions(params);
      const transactionData = response.data.data || [];
      setTransactions(transactionData);
      calculateSummary(transactionData);
      calculateCategorySummary(transactionData);
      checkSpendingAlerts(transactionData);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to fetch transactions. Please try again.');
      }
      console.error('Fetch transactions error:', error.message);
      setTransactions([]);
    }
  }, [filterCategory, filterStartDate, filterEndDate, filterNotes, filterType, filterTags]);

  const calculateSummary = (data) => {
    const total = Array.isArray(data)
      ? data.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      : 0;
    setSummary({ total });
  };

  const calculateCategorySummary = (data) => {
    const summary = Array.isArray(data)
      ? data.reduce((acc, t) => {
          if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
          }
          return acc;
        }, {})
      : {};
    setCategorySummary(summary);
  };

  const checkSpendingAlerts = (data) => {
    const threshold = 200;
    const summary = Array.isArray(data)
      ? data.reduce((acc, t) => {
          if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
          }
          return acc;
        }, {})
      : {};
    const alerts = Object.entries(summary).reduce((acc, [category, amount]) => {
      if (amount > threshold) {
        acc.push(`You've spent $${amount.toFixed(2)} on ${category}, exceeding $${threshold}.`);
      }
      return acc;
    }, []);
    setSpendingAlerts(alerts);
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (values) => {
    try {
      const response = await transactionService.addTransaction(values);
      setTransactions([...transactions, response.data.data]);
      setForm({
        type: 'expense',
        subType: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        tags: '',
        recurrence: '',
        currency: 'USD',
      });
      setOpenedAdd(false);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to add transaction. Please try again.');
      }
      console.error('Add transaction error:', error.message);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      await transactionService.updateTransaction(updatedTransaction._id, {
        category: updatedTransaction.category,
      });
      setTransactions(
        transactions.map((t) =>
          t._id === updatedTransaction._id ? { ...t, category: updatedTransaction.category } : t
        )
      );
      setOpenedEdit(false);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to update transaction. Please try again.');
      }
      console.error('Edit transaction error:', error.message);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(deleteTransactionId);
      setTransactions(transactions.filter((t) => t._id !== deleteTransactionId));
      setOpenedDelete(false);
      setDeleteTransactionId(null);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to delete transaction. Please try again.');
      }
      console.error('Delete transaction error:', error.message);
    }
  };

  const handleCSVImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await transactionService.importCSV(formData);
      setTransactions([...transactions, ...(response.data.data || [])]);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to import CSV. Please check the file format.');
      }
      console.error('CSV import error:', error.message);
    }
  };

  const handleExport = async (format, retries = 3) => {
    try {
      const response = await transactionService[`export${format === 'csv' ? 'Transactions' : 'TransactionsAsPDF'}`]();
      const contentType = format === 'csv' ? 'text/csv' : 'application/pdf';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (error) {
      if (error.message.includes('Session expired')) {
        setError('Session expired. Please log in again.');
      } else if (retries > 0) {
        console.warn(`${format.toUpperCase()} export failed, retrying... (${retries} attempts left)`);
        setTimeout(() => handleExport(format, retries - 1), 1000);
      } else {
        setError(`Failed to export ${format.toUpperCase()}. Please try again or check server status.`);
        console.error(`${format.toUpperCase()} export error:`, error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Transactions</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      <TransactionSummary summary={summary} categorySummary={categorySummary} />
      <SpendingAlerts alerts={spendingAlerts} setAlerts={setSpendingAlerts} />
      <TransactionFilters
        categories={categories}
        subTypes={subTypes}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        filterNotes={filterNotes}
        setFilterNotes={setFilterNotes}
        filterType={filterType}
        setFilterType={setFilterType}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
        transactions={transactions}
        handleCSVImport={handleCSVImport}
        handleExport={handleExport}
        openAdd={() => setOpenedAdd(true)}
      />
      <TransactionList
        transactions={transactions}
        categoryIcons={categoryIcons}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        transactionsPerPage={transactionsPerPage}
        setEditTransaction={setEditTransaction}
        setEditForm={setEditForm}
        setDeleteTransactionId={setDeleteTransactionId}
        openEdit={() => setOpenedEdit(true)}
        openDelete={() => setOpenedDelete(true)}
      />
      <TransactionModals
        openedAdd={openedAdd}
        closeAdd={() => setOpenedAdd(false)}
        openedEdit={openedEdit}
        closeEdit={() => setOpenedEdit(false)}
        openedDelete={openedDelete}
        closeDelete={() => setOpenedDelete(false)}
        form={form}
        setForm={setForm}
        editForm={editForm}
        setEditForm={setEditForm}
        editTransaction={editTransaction}
        handleAddTransaction={handleAddTransaction}
        handleEditTransaction={handleEditTransaction}
        handleDeleteTransaction={handleDeleteTransaction}
        categories={categories}
        subTypes={subTypes}
      />
    </div>
  );
}