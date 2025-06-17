import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import transactionService from '../services/transactionService';
import axios from 'axios';
import BudgetOverview from '../components/Budgets/BudgetOverview';
import BudgetChart from '../components/Budgets/BudgetChart';
import CreateBudgetModal from '../components/Budgets/CreateBudgetModal';
import EditBudgetModal from '../components/Budgets/EditBudgetModal';
import DeleteBudgetModal from '../components/Budgets/DeleteBudgetModal';
import TransactionsModal from '../components/Budgets/TransactionsModal';
import ErrorAlert from '../components/Budgets/ErrorAlert';
import { validateForm, categories } from '../utils/budgetUtils';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [budgetInsights, setBudgetInsights] = useState({ categories: [], spending: [] });
  const [transactions, setTransactions] = useState([]); // Initialize as empty array
  const [error, setError] = useState(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedTransactions, setOpenedTransactions] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const transactionsPerPage = 5;

  const [form, setForm] = useState({
    category: '',
    amount: '',
    currency: 'USD',
    period: 'monthly',
    customPeriod: { startDate: '', endDate: '' },
    recurrence: 'none',
    alertThreshold: 90,
  });

  const [editForm, setEditForm] = useState({
    category: '',
    amount: '',
    currency: 'USD',
    period: 'monthly',
    customPeriod: { startDate: '', endDate: '' },
    recurrence: 'none',
    alertThreshold: 90,
  });

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await budgetService.getBudgets();
      const fetchedBudgets = Array.isArray(response.data) ? response.data : [];
      setBudgets(fetchedBudgets);
      console.log('Fetched budgets:', fetchedBudgets);
      setError(null);
    } catch (err) {
      console.error('Fetch budgets error:', err.message);
      setError(err.message || 'Failed to fetch budgets');
      setBudgets([]);
    }
  }, []); // No dependencies since it doesn't use component state

  const fetchBudgetStatus = useCallback(async () => {
    try {
      const response = await budgetService.getBudgetStatus();
      let filteredStatus = Array.isArray(response.data) ? response.data : [];
      if (filterCategory) filteredStatus = filteredStatus.filter(s => s.category === filterCategory);
      if (filterPeriod) filteredStatus = filteredStatus.filter(s => s.period === filterPeriod);
      setBudgetStatus(filteredStatus);
      console.log('Fetched budget status:', filteredStatus);
      setError(null);
    } catch (err) {
      console.error('Fetch budget status error:', err.message);
      setError(err.message || 'Failed to fetch budget status');
      setBudgetStatus([]);
    }
  }, [filterCategory, filterPeriod]); // Include filterCategory and filterPeriod

  const fetchBudgetInsights = useCallback(async () => {
    try {
      const response = await budgetService.getBudgetInsights();
      setBudgetInsights(response.data || { categories: [], spending: [] });
      console.log('Fetched budget insights:', response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch budget insights error:', err.message);
      setError(err.message || 'Failed to fetch budget insights');
      setBudgetInsights({ categories: [], spending: [] });
    }
  }, []); // No dependencies since it doesn't use component state

  const fetchTransactionsForBudget = useCallback(async (budget) => {
    try {
      setLoadingTransactions(true);
      const { startDate, endDate } = budget.periodDates;
      const dateRange = `${new Date(startDate).toISOString().split('T')[0]},${new Date(endDate).toISOString().split('T')[0]}`;
      console.log(`Fetching transactions for budget ${budget._id}: category=${budget.category}, dateRange=${dateRange}`);
      const response = await transactionService.getTransactions({
        category: budget.category,
        dateRange,
      });
      const fetchedTransactions = Array.isArray(response.data.data) ? response.data.data : [];
      setTransactions(fetchedTransactions);
      console.log('Fetched transactions:', fetchedTransactions);
      setCurrentPage(1);
      setOpenedTransactions(true);
      setError(null);
    } catch (err) {
      console.error('Fetch transactions error:', err.message);
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]); // Reset to empty array on error
    } finally {
      setLoadingTransactions(false);
    }
  }, []); // No dependencies since budget is passed as an argument

  const handleCreateBudget = useCallback(async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        alertThreshold: parseFloat(form.alertThreshold),
        customPeriod: form.period === 'custom' ? form.customPeriod : undefined,
      };
      await budgetService.createBudget(payload);
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()]);
      setForm({
        category: '', amount: '', currency: 'USD', period: 'monthly',
        customPeriod: { startDate: '', endDate: '' }, recurrence: 'none', alertThreshold: 90,
      });
      setOpenedCreate(false);
      setError(null);
    } catch (err) {
      console.error('Create budget error:', err.message);
      setError(err.message || 'Failed to create budget');
    }
  }, [form, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights]);

  const handleEditBudget = useCallback(async () => {
    const validationError = validateForm(editForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const payload = {
        ...editForm,
        amount: parseFloat(editForm.amount),
        alertThreshold: parseFloat(editForm.alertThreshold),
        customPeriod: editForm.period === 'custom' ? editForm.customPeriod : undefined,
      };
      await budgetService.updateBudget(editingBudget._id, payload);
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()]);
      setEditForm({
        category: '', amount: '', currency: 'USD', period: 'monthly',
        customPeriod: { startDate: '', endDate: '' }, recurrence: 'none', alertThreshold: 90,
      });
      setOpenedEdit(false);
      setEditingBudget(null);
      setError(null);
    } catch (err) {
      console.error('Update budget error:', err.message);
      setError(err.message || 'Failed to update budget');
    }
  }, [editForm, editingBudget, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights]);

  const handleDeleteBudget = useCallback(async () => {
    try {
      await budgetService.deleteBudget(deleteBudgetId);
      await Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()]);
      setOpenedDelete(false);
      setDeleteBudgetId(null);
      setError(null);
    } catch (err) {
      console.error('Delete budget error:', err.message);
      setError(err.message || 'Failed to delete budget');
    }
  }, [deleteBudgetId, fetchBudgets, fetchBudgetStatus, fetchBudgetInsights]);

  const handleExport = useCallback(async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/budgets/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `budgets.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null);
    } catch (err) {
      console.error('Export budgets error:', err.message);
      setError('Failed to export budgets');
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()]);
  }, [fetchBudgets, fetchBudgetStatus, fetchBudgetInsights, filterCategory, filterPeriod]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Budgets</h2>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => setOpenedCreate(true)}
        >
          Create Budget
        </button>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          aria-label="Filter by period"
        >
          <option value="">All Periods</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => handleExport('csv')}
        >
          Export CSV
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => handleExport('pdf')}
        >
          Export PDF
        </button>
      </div>
      <BudgetOverview
        budgetStatus={budgetStatus}
        budgets={budgets}
        onViewTransactions={fetchTransactionsForBudget}
        onEdit={(budget) => {
          setEditingBudget(budget);
          setEditForm({
            category: budget.category || '',
            amount: budget.amount?.toString() || '',
            currency: budget.currency || 'USD',
            period: budget.period || 'monthly',
            customPeriod: {
              startDate: budget.customPeriod?.startDate ? new Date(budget.customPeriod.startDate).toISOString().split('T')[0] : '',
              endDate: budget.customPeriod?.endDate ? new Date(budget.customPeriod.endDate).toISOString().split('T')[0] : '',
            },
            recurrence: budget.recurrence || 'none',
            alertThreshold: budget.alertThreshold || 90,
          });
          setOpenedEdit(true);
        }}
        onDelete={(id) => {
          setDeleteBudgetId(id);
          setOpenedDelete(true);
        }}
      />
      <BudgetChart budgetInsights={budgetInsights} />
      <CreateBudgetModal
        isOpen={openedCreate}
        onClose={() => setOpenedCreate(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateBudget}
      />
      <EditBudgetModal
        isOpen={openedEdit}
        onClose={() => setOpenedEdit(false)}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditBudget}
      />
      <DeleteBudgetModal
        isOpen={openedDelete}
        onClose={() => setOpenedDelete(false)}
        onConfirm={handleDeleteBudget}
      />
      <TransactionsModal
        isOpen={openedTransactions}
        onClose={() => {
          setOpenedTransactions(false);
          setTransactions([]); // Reset transactions
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