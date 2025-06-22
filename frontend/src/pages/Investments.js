import { useState, useEffect, useCallback } from 'react';
import investmentService from '../services/investmentService';
import ErrorAlert from '../components/Budgets/ErrorAlert';
import CreateInvestmentModal from '../components/Investments/CreateInvestmentModal';
import EditInvestmentModal from '../components/Investments/EditInvestmentModal';
import DeleteInvestmentModal from '../components/Investments/DeleteInvestmentModal';
import InvestmentChart from '../components/Investments/InvestmentChart';

export const investmentTypes = ['stock', 'bond', 'mutual fund', 'ETF', 'real estate', 'crypto'];

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [error, setError] = useState(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(false);
  const [openedDelete, setOpenedDelete] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [deleteInvestmentId, setDeleteInvestmentId] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartType, setChartType] = useState('time');
  const investmentsPerPage = 10;

  const [form, setForm] = useState({
    name: '',
    type: '',
    initialInvestment: '',
    currentValue: '',
    currency: 'USD',
    institution: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    initialInvestment: '',
    currentValue: '',
    currency: 'USD',
    institution: '',
    purchaseDate: '',
    notes: '',
  });

  const getUserFriendlyError = (err) => {
    if (err.message.includes('404')) {
      return 'Unable to load investments. The service is unavailable. Please try again later.';
    } else if (err.message.includes('Session expired')) {
      return 'Your session has expired. Please log in again.';
    } else if (err.message.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return 'An unexpected error occurred. Please try again later.';
  };

  const fetchInvestments = useCallback(async () => {
    try {
      const { investments, total } = await investmentService.getInvestments({
        page: currentPage,
        limit: investmentsPerPage,
      });
      setInvestments(investments || []);
      setFilteredInvestments(investments || []);
      setTotalInvestments(total || 0);
      console.log('Fetched investments:', investments);
      setError(null);
    } catch (err) {
      console.error('Fetch investments error:', err);
      setError(getUserFriendlyError(err));
      setInvestments([]);
      setFilteredInvestments([]);
      setTotalInvestments(0);
    }
  }, [currentPage]);

  const handleCreateInvestment = useCallback(async () => {
    if (!form.name || !form.type || !form.initialInvestment || !form.currentValue || !form.currency || !form.purchaseDate) {
      setError('All required fields must be filled');
      return;
    }
    try {
      await investmentService.addInvestment({
        ...form,
        initialInvestment: parseFloat(form.initialInvestment),
        currentValue: parseFloat(form.currentValue),
      });
      await fetchInvestments();
      setForm({
        name: '',
        type: '',
        initialInvestment: '',
        currentValue: '',
        currency: 'USD',
        institution: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setOpenedCreate(false);
      setError(null);
    } catch (err) {
      console.error('Create investment error:', err);
      setError(getUserFriendlyError(err));
    }
  }, [form, fetchInvestments]);

  const handleEditInvestment = useCallback(async () => {
    if (!editForm.name || !editForm.type || !editForm.initialInvestment || !editForm.currentValue || !editForm.currency || !editForm.purchaseDate) {
      setError('All required fields must be filled');
      return;
    }
    try {
      await investmentService.updateInvestment(editingInvestment._id, {
        ...editForm,
        initialInvestment: parseFloat(editForm.initialInvestment),
        currentValue: parseFloat(editForm.currentValue),
      });
      await fetchInvestments();
      setEditForm({
        name: '',
        type: '',
        initialInvestment: '',
        currentValue: '',
        currency: 'USD',
        institution: '',
        purchaseDate: '',
        notes: '',
      });
      setOpenedEdit(false);
      setEditingInvestment(null);
      setError(null);
    } catch (err) {
      console.error('Error updating investment:', err);
      setError(getUserFriendlyError(err));
    }
  }, [editForm, editingInvestment, fetchInvestments]);

  const handleDeleteInvestment = useCallback(async () => {
    try {
      await investmentService.deleteInvestment(deleteInvestmentId);
      await fetchInvestments();
      setOpenedDelete(false);
      setDeleteInvestmentId(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting investment:', err);
      setError(getUserFriendlyError(err));
    }
  }, [deleteInvestmentId, fetchInvestments]);

  const handleExportCSV = useCallback(async (retries = 3) => {
    try {
      const response = await investmentService.exportToCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'investments.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error('Export investments error:', err);
      if (err.message.includes('Session expired')) {
        setError('Your session has expired. Please log in again.');
      } else if (retries > 0) {
        console.warn(`CSV export failed, retrying... (${retries} attempts left)`);
        setTimeout(() => handleExportCSV(retries - 1), 1000);
      } else {
        setError('Unable to export investments to CSV. Please try again later.');
      }
    }
  }, []);

  const handleExportPDF = useCallback(async (retries = 3) => {
    try {
      const response = await investmentService.exportToPDF();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'investments.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error('Export PDF error:', err);
      if (err.message.includes('Session expired')) {
        setError('Your session has expired. Please log in again.');
      } else if (retries > 0) {
        console.warn(`PDF export failed, retrying... (${retries} attempts left)`);
        setTimeout(() => handleExportPDF(retries - 1), 1000);
      } else {
        setError('Unable to export investments to PDF. Please try again later.');
      }
    }
  }, []);

  const handleFilterType = useCallback((type) => {
    setFilterType(type);
    if (type && Array.isArray(investments)) {
      setFilteredInvestments(investments.filter(inv => inv.type === type));
    } else {
      setFilteredInvestments(investments || []);
    }
  }, [investments]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  useEffect(() => {
    handleFilterType(filterType);
  }, [investments, filterType, handleFilterType]);

  const totalPages = Math.ceil(totalInvestments / investmentsPerPage);

  const totalPortfolioValue = Array.isArray(filteredInvestments)
    ? filteredInvestments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
    : 0;
  const totalReturn = Array.isArray(filteredInvestments)
    ? filteredInvestments.reduce((sum, inv) => {
        const initial = inv.initialInvestment || 0;
        const current = inv.currentValue || 0;
        return sum + (initial > 0 ? ((current - initial) / initial) * 100 : 0);
      }, 0) / (filteredInvestments.length || 1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Investments</h2>
      <ErrorAlert error={error} onClose={() => setError(null)} />
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Portfolio Performance</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-lg ${chartType === 'time' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setChartType('time')}
            >
              Time Series
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${chartType === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setChartType('type')}
            >
              By Type
            </button>
          </div>
        </div>
        <InvestmentChart investments={filteredInvestments || []} chartType={chartType} />
      </div>
      <div className="mb-6 bg-white shadow-sm rounded-md border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Portfolio Summary</h3>
        <p className="text-gray-500">Total Value: ${totalPortfolioValue.toFixed(2)}</p>
        <p className="text-gray-500">Average Return: {totalReturn.toFixed(2)}%</p>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => setOpenedCreate(true)}
        >
          Add Investment
        </button>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => handleFilterType(e.target.value)}
          aria-label="Filter by investment type"
        >
          <option value="">All Types</option>
          {investmentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => handleExportCSV()}
        >
          Export CSV
        </button>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => handleExportPDF()}
        >
          Export PDF
        </button>
      </div>
      {Array.isArray(filteredInvestments) && filteredInvestments.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Investment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvestments.map(investment => (
                <tr key={investment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${investment.currentValue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${investment.initialInvestment.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {investment.initialInvestment > 0
                      ? (((investment.currentValue - investment.initialInvestment) / investment.initialInvestment) * 100).toFixed(2)
                      : '0.00'}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.institution || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investment.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 mr-2"
                      onClick={() => {
                        setEditingInvestment(investment);
                        setEditForm({
                          name: investment.name,
                          type: investment.type,
                          initialInvestment: investment.initialInvestment.toString(),
                          currentValue: investment.currentValue.toString(),
                          currency: investment.currency,
                          institution: investment.institution || '',
                          purchaseDate: new Date(investment.purchaseDate).toISOString().split('T')[0],
                          notes: investment.notes || '',
                        });
                        setOpenedEdit(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteInvestmentId(investment._id);
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No investments found</p>
      )}
      <CreateInvestmentModal
        isOpen={openedCreate}
        onClose={() => setOpenedCreate(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreateInvestment}
      />
      <EditInvestmentModal
        isOpen={openedEdit}
        onClose={() => setOpenedEdit(false)}
        form={editForm}
        setForm={setEditForm}
        onSubmit={handleEditInvestment}
      />
      <DeleteInvestmentModal
        isOpen={openedDelete}
        onClose={() => setOpenedDelete(false)}
        onConfirm={handleDeleteInvestment}
      />
    </div>
  );
}