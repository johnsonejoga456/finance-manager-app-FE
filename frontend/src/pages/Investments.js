import { useEffect, useState } from 'react';
import {
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  exportCSV,
  exportPDF,
} from '../services/investmentService';

import CreateInvestmentModal from '../components/Investments/CreateInvestmentModal';
import EditInvestmentModal from '../components/Investments/EditInvestmentModal';
import DeleteInvestmentModal from '../components/Investments/DeleteInvestmentModal';
import InvestmentChart from '../components/Investments/InvestmentChart';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [deletingInvestment, setDeletingInvestment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    initialInvestment: '',
    currentValue: '',
    currency: '',
    institution: '',
    purchaseDate: '',
    notes: '',
  });
  const [chartType, setChartType] = useState('type');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const { investments, total } = await getInvestments(page, limit);
      setInvestments(investments);
      setTotal(total);
    } catch (err) {
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [page]);

  const handleCreate = async () => {
    try {
      await addInvestment(form);
      toast.success('Investment added successfully');
      fetchInvestments();
      setShowCreateModal(false);
      setForm({
        name: '',
        type: '',
        initialInvestment: '',
        currentValue: '',
        currency: '',
        institution: '',
        purchaseDate: '',
        notes: '',
      });
    } catch {
      toast.error('Failed to add investment');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateInvestment(id, updatedData);
      toast.success('Investment updated');
      fetchInvestments();
      setEditingInvestment(null);
    } catch {
      toast.error('Failed to update investment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvestment(id);
      toast.success('Investment deleted');
      fetchInvestments();
      setDeletingInvestment(null);
    } catch {
      toast.error('Failed to delete investment');
    }
  };

  const handleExportCSV = () => exportCSV();
  const handleExportPDF = () => exportPDF();

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold">Investments</h1>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="bg-blue-500 text-white px-3 py-1 rounded">Export CSV</button>
          <button onClick={handleExportPDF} className="bg-purple-500 text-white px-3 py-1 rounded">Export PDF</button>
          <button onClick={() => setShowCreateModal(true)} className="bg-green-600 text-white px-3 py-1 rounded">+ Add Investment</button>
        </div>
      </div>

      <div className="mb-4 flex justify-end gap-2">
        <button
          className={`px-3 py-1 border rounded ${chartType === 'type' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setChartType('type')}
        >
          Pie Chart
        </button>
        <button
          className={`px-3 py-1 border rounded ${chartType === 'time' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setChartType('time')}
        >
          Line Chart
        </button>
      </div>

      <InvestmentChart investments={investments} chartType={chartType} />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Initial ($)</th>
                <th className="p-2">Current ($)</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Institution</th>
                <th className="p-2">Purchase Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv._id} className="border-b">
                  <td className="p-2">{inv.name}</td>
                  <td className="p-2 capitalize">{inv.type}</td>
                  <td className="p-2">${inv.initialInvestment.toFixed(2)}</td>
                  <td className="p-2">${inv.currentValue.toFixed(2)}</td>
                  <td className="p-2">{inv.currency}</td>
                  <td className="p-2">{inv.institution || '-'}</td>
                  <td className="p-2">{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => setEditingInvestment(inv)} className="text-blue-600">Edit</button>
                    <button onClick={() => setDeletingInvestment(inv)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {investments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">No investments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          Prev
        </button>
        <span className="text-sm mt-1">Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <CreateInvestmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreate}
      />

      {editingInvestment && (
        <EditInvestmentModal
          investment={editingInvestment}
          onClose={() => setEditingInvestment(null)}
          onSave={handleUpdate}
        />
      )}

      {deletingInvestment && (
        <DeleteInvestmentModal
          investment={deletingInvestment}
          onClose={() => setDeletingInvestment(null)}
          onConfirm={() => handleDelete(deletingInvestment._id)}
        />
      )}
    </div>
  );
};

export default Investments;
