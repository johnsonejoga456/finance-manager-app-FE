import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardSummary } from '../../services/dashboardService';
import SummaryCards from '../../components/Dashboard/SummaryCards';
import DashboardCharts from '../../components/Dashboard/DashboardCharts';
import RecentActivity from '../../components/Dashboard/RecentActivity';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardSummary();
      setOverview(data);
    } catch (err) {
      console.error('Fetch dashboard error:', err.message);
      toast.error(err.message);
      if (err.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view the dashboard');
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <nav className="mb-6">
        <ul className="flex space-x-4">
          <li><Link to="/accounts" className="text-blue-600 hover:underline">Accounts</Link></li>
          <li><Link to="/transactions" className="text-blue-600 hover:underline">Transactions</Link></li>
          <li><Link to="/budgets" className="text-blue-600 hover:underline">Budgets</Link></li>
          <li><Link to="/goals" className="text-blue-600 hover:underline">Goals</Link></li>
          <li><Link to="/debts" className="text-blue-600 hover:underline">Debts</Link></li>
          <li><Link to="/investments" className="text-blue-600 hover:underline">Investments</Link></li>
        </ul>
      </nav>
      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : !overview || (!overview.accounts?.topAccounts?.length && !overview.transactions?.recent?.length && !overview.budgets?.activeBudgets?.length && !overview.goals?.activeGoals?.length && !overview.debts?.totalDebt && !overview.investments?.recentInvestments?.length) ? (
        <p className="text-center text-gray-500">No data available. Add data in Accounts, Transactions, Budgets, Goals, Debts, or Investments.</p>
      ) : (
        <>
          <SummaryCards overview={overview} />
          <DashboardCharts overview={overview} />
          <RecentActivity overview={overview} />
        </>
      )}
    </div>
  );
};

export default Dashboard;