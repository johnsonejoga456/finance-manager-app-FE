import { useState, useEffect } from 'react';
import debtService from '../services/debtService';
import axios from 'axios';
import DebtOverview from '../components/Debts/DebtOverview';
import DebtChart from '../components/Debts/DebtChart';
import CreateDebtModal from '../components/Debts/CreateDebtModal';
import EditDebtModal from '../components/Debts/EditDebtModal';
import DeleteDebtModal from '../components/Debts/DeleteDebtModal';
import RepaymentStrategy from '../components/Debts/RepaymentStrategy';
import ErrorAlert from '../components/Budgets/ErrorAlert';
import { validateDebt, types } from '../utils/debtUtils';

export default function Debts() {
  const [debts, setDebts] = useState([]);
  const [debtStatus, setDebtStatus] = useState([]);
  const [repaymentStrategies, setRepaymentStrategies] = useState({ snowball: [], avalanche: [] });
  const [error, setError] = useState(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [deleteDebtId, setDeleteDebtId] = useState(null);
  const [filterType, setFilterType] = useState('');

  const [form, setForm] = useState({
    description: '',
    creditor: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
  });

  const [editForm, setEditForm] = useState({
    description: '',
    creditor: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
  });

  const fetchDebts = async () => {
    try {
      const response = await debtService.getDebts();
      let filteredDebts = response.data || [];
      if (filterType) filteredDebts = filteredDebts.filter(d => d.type === filterType);
      setDebts(filteredDebts);
      setDebtStatus(filteredDebts.map(d => {
        const initialBalance = Number(d.initialBalance) || 0;
        const balance = Number(d.balance) || 0;
        const progress = initialBalance > 0 ? ((initialBalance - balance) / initialBalance * 100) : 0;
        console.log(`Debt ${d.description}: initialBalance=${initialBalance}, balance=${balance}, progress=${progress}%`);
        return {
          id: d._id,
          description: d.description,
          creditor: d.creditor,
          balance,
          interestRate: d.interestRate,
          minimumPayment: d.minimumPayment,
          dueDate: d.dueDate,
          progress: isNaN(progress) ? 0 : progress,
        };
      }));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch debts');
    }
  };

  const fetchRepaymentStrategies = async () => {
    try {
      const response = await debtService.getRepaymentStrategies();
      setRepaymentStrategies(response.data || { snowball: [], avalanche: [] });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch repayment strategies');
    }
  };

  const handleCreateDebt = async () => {
    const validationError = validateDebt(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const payload = {
        ...form,
        balance: parseFloat(form.balance),
        interestRate: parseFloat(form.interestRate),
        minimumPayment: parseFloat(form.minimumPayment),
        dueDate: form.dueDate,
      };
      await debtService.createDebt(payload);
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()]);
      setForm({
        description: '', creditor: '', balance: '', interestRate: '', minimumPayment: '', dueDate: '',
      });
      setOpenedCreate(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create debt');
    }
  };

  const handleEditDebt = async () => {
    const validationError = validateDebt(editForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const payload = {
        ...editForm,
        balance: parseFloat(editForm.balance),
        interestRate: parseFloat(editForm.interestRate),
        minimumPayment: parseFloat(editForm.minimumPayment),
        dueDate: editForm.dueDate,
      };
      await debtService.updateDebt(editingDebt._id, payload);
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()]);
      setEditForm({
        description: '', creditor: '', balance: '', interestRate: '', minimumPayment: '', dueDate: '',
      });
      setOpenedEdit(false);
      setEditingDebt(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update debt');
    }
  };

  const handleDeleteDebt = async () => {
    try {
      await debtService.deleteDebt(deleteDebtId);
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()]);
      setOpenedDelete(false);
      setDeleteDebtId(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete debt');
    }
  };

  const handleRecordPayment = async (debtId, amount, date) => {
    try {
      await debtService.recordPayment(debtId, { amount, date });
      await Promise.all([fetchDebts(), fetchRepaymentStrategies()]);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/debts/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `debts.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setError(null);
    } catch (err) {
      setError('Failed to export debts');
    }
  };

  useEffect(() => {
    Promise.all([fetchDebts(), fetchRepaymentStrategies()]);
  }, [filterType]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Debt Management</h2>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => setOpenedCreate(true)}
        >
          Add Debt
        </button>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
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
      <DebtOverview
        debtStatus={debtStatus}
        debts={debts}
        onPayment={handleRecordPayment}
        onEdit={(debt) => {
          setEditingDebt(debt);
          setEditForm({
            description: debt.description || '',
            creditor: debt.creditor || '',
            balance: debt.balance?.toString() || '',
            interestRate: debt.interestRate?.toString() || '',
            minimumPayment: debt.minimumPayment?.toString() || '',
            dueDate: debt.dueDate ? new Date(debt.dueDate).toISOString().split('T')[0] : '',
          });
          setOpenedEdit(true);
        }}
        onDelete={(id) => {
          setDeleteDebtId(id);
          setOpenedDelete(true);
        }}
      />
      <DebtChart debts={debts} />
      <RepaymentStrategy strategies={repaymentStrategies} />
      <CreateDebtModal
        isOpen={openedCreate}
        onClose={() => setOpenedCreate(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateDebt}
      />
      <EditDebtModal
        isOpen={openedEdit}
        onClose={() => setOpenedEdit(false)}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditDebt}
      />
      <DeleteDebtModal
        isOpen={openedDelete}
        onClose={() => setOpenedDelete(false)}
        onConfirm={handleDeleteDebt}
      />
    </div>
  );
}