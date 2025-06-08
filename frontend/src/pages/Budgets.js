import { useState, useEffect, useRef } from 'react';
import { budgetService } from '../services/budgetService';
import transactionService from '../services/transactionService';
import Chart from 'chart.js/auto';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [budgetInsights, setBudgetInsights] = useState({ categories: [], spending: [] });
  const [transactions, setTransactions] = useState([]);
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
  const transactionsPerPage = 5;
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const categories = [
    'Bar', 'Entertainment', 'Fuel', 'Shoes/Clothing', 'Credit Card',
    'Eating Out', 'Technology', 'Gifts', 'Other',
  ];

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

  const validateForm = (data) => {
    if (!data.category) return 'Category is required';
    if (!data.amount || data.amount <= 0) return 'Amount must be greater than 0';
    if (data.period === 'custom') {
      if (!data.customPeriod.startDate || !data.customPeriod.endDate) return 'Start and end dates are required';
      if (new Date(data.customPeriod.startDate) >= new Date(data.customPeriod.endDate)) return 'End date must be after start date';
    }
    if (data.alertThreshold < 0 || data.alertThreshold > 100) return 'Threshold must be between 0 and 100';
    return null;
  };

  const fetchBudgets = async () => {
    try {
      const response = await budgetService.getBudgets();
      setBudgets(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBudgetStatus = async () => {
    try {
      const response = await budgetService.getBudgetStatus();
      let filteredStatus = response.data;
      if (filterCategory) filteredStatus = filteredStatus.filter(s => s.category === filterCategory);
      if (filterPeriod) filteredStatus = filteredStatus.filter(s => s.period === filterPeriod);
      setBudgetStatus(filteredStatus);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBudgetInsights = async () => {
    try {
      const response = await budgetService.getBudgetInsights();
      setBudgetInsights(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTransactionsForBudget = async (budget) => {
    try {
      const { startDate, endDate } = budget.periodDates;
      const response = await transactionService.getTransactions({
        category: budget.category,
        dateRange: `${startDate.toISOString().split('T')[0]},${endDate.toISOString().split('T')[0]}`,
      });
      setTransactions(response.data.data || []);
      setCurrentPage(1);
      setOpenedTransactions(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateBudget = async () => {
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
      const response = await budgetService.createBudget(payload);
      setBudgets([...budgets, response.data]);
      await Promise.all([fetchBudgetStatus(), fetchBudgetInsights()]);
      setForm({
        category: '', amount: '', currency: 'USD', period: 'monthly',
        customPeriod: { startDate: '', endDate: '' }, recurrence: 'none', alertThreshold: 90,
      });
      setOpenedCreate(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBudget = async () => {
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
      const response = await budgetService.updateBudget(editingBudget.id, payload);
      setBudgets(budgets.map(b => b._id === editingBudget.id ? response.data : b));
      await Promise.all([fetchBudgetStatus(), fetchBudgetInsights()]);
      setEditForm({
        category: '', amount: '', currency: 'USD', period: 'monthly',
        customPeriod: { startDate: '', endDate: '' }, recurrence: 'none', alertThreshold: 90,
      });
      setOpenedEdit(false);
      setEditingBudget(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await budgetService.deleteBudget(deleteBudgetId);
      setBudgets(budgets.filter(b => b._id !== deleteBudgetId));
      await Promise.all([fetchBudgetStatus(), fetchBudgetInsights()]);
      setOpenedDelete(false);
      setDeleteBudgetId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    Promise.all([fetchBudgets(), fetchBudgetStatus(), fetchBudgetInsights()]);
  }, [filterCategory, filterPeriod]);

  useEffect(() => {
    if (chartRef.current && budgetInsights.categories.length) {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: budgetInsights.categories,
          datasets: [
            {
              label: 'Budgeted',
              data: budgetInsights.spending.map(s => s.budgeted),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Spent',
              data: budgetInsights.spending.map(s => s.spent),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Budget vs. Spending by Category' },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Amount ($)' } },
            x: { title: { display: true, text: 'Category' } },
          },
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [budgetInsights]);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Budgets</h2>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          {error}
          <button className="float-right" onClick={() => setError(null)}>X</button>
        </div>
      )}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
      </div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className="border-b-2 border-blue-500 text-blue-600 py-4 px-1 font-medium"
              aria-current="page"
            >
              Overview
            </button>
            <button
              className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-4 px-1 font-medium"
            >
              Insights
            </button>
          </nav>
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatus.map(status => (
              <div
                key={status.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                aria-label={`Budget card for ${status.category}`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{status.category}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(status.periodDates.startDate).toLocaleDateString()} -{' '}
                  {new Date(status.periodDates.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Budgeted: ${status.budgeted.toFixed(2)}</p>
                <p className="text-gray-600">Spent: ${status.spent.toFixed(2)}</p>
                <p className={`text-${status.remaining >= 0 ? 'green' : 'red'}-600`}>
                  Remaining: ${status.remaining.toFixed(2)}
                </p>
                {status.alertTriggered && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mt-2 text-sm" role="alert">
                    Spending at {status.percentage.toFixed(0)}% of budget!
                  </div>
                )}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${status.percentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(status.percentage, 100)}%` }}
                      aria-label={`Spending progress for ${status.category}`}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                    onClick={() => fetchTransactionsForBudget(status)}
                    aria-label={`View transactions for ${status.category}`}
                  >
                    View Transactions
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                      onClick={() => {
                        setEditingBudget({ id: status.id, ...budgets.find(b => b._id === status.id) });
                        setEditForm({
                          category: status.category,
                          amount: status.budgeted.toString(),
                          currency: status.currency,
                          period: status.period,
                          customPeriod: {
                            startDate: status.periodDates.startDate,
                            endDate: status.periodDates.endDate,
                          },
                          recurrence: status.recurrence,
                          alertThreshold: status.alertThreshold,
                        });
                        setOpenedEdit(true);
                      }}
                      aria-label={`Edit ${status.category} budget`}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:bg-red-100 p-2 rounded"
                      onClick={() => {
                        setDeleteBudgetId(status.id);
                        setOpenedDelete(true);
                      }}
                      aria-label={`Delete ${status.category} budget`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 hidden">
            <canvas ref={chartRef} aria-label="Budget vs Spending Chart"></canvas>
          </div>
        </div>
      </div>

      {/* Create Budget Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${openedCreate ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Create Budget</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="category" className="block mb-1 text-sm font-semibold text-gray-700">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block mb-1 text-sm font-semibold text-gray-700">Amount</label>
              <input
                id="amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block mb-1 text-sm font-semibold text-gray-700">Currency</label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="period" className="block mb-1 text-sm font-semibold text-gray-700">Period</label>
              <select
                id="period"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {form.period === 'custom' && (
              <>
                <div>
                  <label htmlFor="startDate" className="block mb-1 text-sm font-semibold text-gray-700">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    value={form.customPeriod.startDate}
                    onChange={(e) => setForm({ ...form, customPeriod: { ...form.customPeriod, startDate: e.target.value } })}
                    className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block mb-1 text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    value={form.customPeriod.endDate}
                    onChange={(e) => setForm({ ...form, customPeriod: { ...form.customPeriod, endDate: e.target.value } })}
                    className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="recurrence" className="block mb-1 text-sm font-semibold text-gray-700">Recurrence</label>
              <select
                id="recurrence"
                value={form.recurrence}
                onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="alertThreshold" className="block mb-1 text-sm font-semibold text-gray-700">Alert Threshold (%)</label>
              <input
                id="alertThreshold"
                type="number"
                value={form.alertThreshold}
                onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              onClick={() => setOpenedCreate(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={handleCreateBudget}
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${openedEdit ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Edit Budget</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="editCategory" className="block mb-1 text-sm font-semibold text-gray-700">Category</label>
              <select
                id="editCategory"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="editAmount" className="block mb-1 text-sm font-semibold text-gray-700">Amount</label>
              <input
                id="editAmount"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="editCurrency" className="block mb-1 text-sm font-semibold text-gray-700">Currency</label>
              <select
                id="editCurrency"
                value={editForm.currency}
                onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="editPeriod" className="block mb-1 text-sm font-semibold text-gray-700">Period</label>
              <select
                id="editPeriod"
                value={editForm.period}
                onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {editForm.period === 'custom' && (
              <>
                <div>
                  <label htmlFor="editStartDate" className="block mb-1 text-sm font-semibold text-gray-700">Start Date</label>
                  <input
                    id="editStartDate"
                    type="date"
                    value={editForm.customPeriod.startDate}
                    onChange={(e) => setEditForm({ ...editForm, customPeriod: { ...editForm.customPeriod, startDate: e.target.value } })}
                    className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editEndDate" className="block mb-1 text-sm font-semibold text-gray-700">End Date</label>
                  <input
                    id="editEndDate"
                    type="date"
                    value={editForm.customPeriod.endDate}
                    onChange={(e) => setEditForm({ ...editForm, customPeriod: { ...editForm.customPeriod, endDate: e.target.value } })}
                    className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="editRecurrence" className="block mb-1 text-sm font-semibold text-gray-700">Recurrence</label>
              <select
                id="editRecurrence"
                value={editForm.recurrence}
                onChange={(e) => setEditForm({ ...editForm, recurrence: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="editAlertThreshold" className="block mb-1 text-sm font-semibold text-gray-700">Alert Threshold (%)</label>
              <input
                id="editAlertThreshold"
                type="number"
                value={editForm.alertThreshold}
                onChange={(e) => setEditForm({ ...editForm, alertThreshold: e.target.value })}
                className="border rounded-lg w-full px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              onClick={() => setOpenedEdit(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={handleEditBudget}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${openedDelete ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this budget?</p>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              onClick={() => setOpenedDelete(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={handleDeleteBudget}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 ${openedTransactions ? 'flex' : 'hidden'} items-center justify-center z-50 p-4`}
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Budget Transactions</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map(t => (
                <tr key={t._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              onClick={() => setOpenedTransactions(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}