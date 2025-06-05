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
  const [filteredTransactions, setFilteredTransactions] = useState([]);
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
  const [spendingAlerts, setSpendingAlerts] = useState([]);
  const transactionsPerPage = 5;

  const categories = ['Bar', 'Entertainment', 'Fuel', 'Shoes/Clothing', 'Credit Card', 'Eating Out', 'Technology', 'Gifts', 'Other'];
  const subTypes = {
    income: ['salary', 'bonus', 'freelance', 'gift', 'refund'],
    expense: ['groceries', 'rent', 'utilities', 'subscription'],
    transfer: ['savings'],
    investment: ['stocks', 'bonds'],
  };

  // Updated categoryIcons with Font Awesome
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
      const response = await transactionService.getTransactions();
      const transactionData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setTransactions(transactionData);
      setFilteredTransactions(transactionData);
      calculateSummary(transactionData);
      calculateCategorySummary(transactionData);
      checkSpendingAlerts(transactionData);
    } catch (error) {
      setTransactions([]);
      setFilteredTransactions([]);
    }
  }, []);

  const calculateSummary = (data) => {
    const total = Array.isArray(data) ? data.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0) : 0;
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
    const alerts = [];
    const threshold = 200;
    const summary = Array.isArray(data)
      ? data.reduce((acc, t) => {
          if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
          }
          return acc;
        }, {})
      : {};
    Object.entries(summary).forEach(([category, total]) => {
      if (total > threshold) {
        alerts.push(`You’ve spent $${total.toFixed(2)} on ${category} this month, exceeding your threshold of $${threshold}.`);
      }
    });
    setSpendingAlerts(alerts);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
    if (filterStartDate && filterEndDate) {
      const start = new Date(filterStartDate);
      const end = new Date(filterEndDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        filtered = filtered.filter((t) => {
          const txDate = new Date(t.date);
          return !isNaN(txDate.getTime()) && txDate >= start && txDate <= end;
        });
      }
    }
    if (filterNotes) filtered = filtered.filter((t) => t.notes?.toLowerCase().includes(filterNotes.toLowerCase()));
    if (filterType) filtered = filtered.filter((t) => t.type === filterType);
    if (filterTags) filtered = filtered.filter((t) => (t.tags || []).includes(filterTags));

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
    calculateCategorySummary(filtered);
    checkSpendingAlerts(filtered);
  }, [filterCategory, filterStartDate, filterEndDate, filterNotes, filterType, filterTags, transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddTransaction = async (values) => {
    try {
      const response = await transactionService.addTransaction(values);
      setTransactions([...transactions, response.data]);
      setOpenedAdd(false);
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
    } catch (error) {}
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      await transactionService.updateTransaction(editTransaction._id, updatedTransaction);
      setTransactions(transactions.map((t) => (t._id === editTransaction._id ? updatedTransaction : t)));
      setOpenedEdit(false);
    } catch (error) {}
  };

  const handleDeleteTransaction = async () => {
    try {
      await transactionService.deleteTransaction(deleteTransactionId);
      setTransactions(transactions.filter((t) => t._id !== deleteTransactionId));
      setOpenedDelete(false);
      setDeleteTransactionId(null);
    } catch (error) {}
  };

  const handleCSVImport = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await transactionService.importCSV(formData);
      setTransactions([...transactions, ...response.data]);
    } catch (error) {}
  };

  const handleExport = async (format) => {
    try {
      const response = await transactionService[`exportTransactions${format === 'csv' ? '' : 'AsPDF'}`]();
      const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Transactions</h2>
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
        transactions={filteredTransactions}
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