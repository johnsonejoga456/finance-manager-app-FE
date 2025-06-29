import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          <nav className="mb-6">
            <ul className="flex space-x-4">
              <li><a href="/accounts" className="text-blue-600 hover:underline">Accounts</a></li>
              <li><a href="/transactions" className="text-blue-600 hover:underline">Transactions</a></li>
              <li><a href="/budgets" className="text-blue-600 hover:underline">Budgets</a></li>
              <li><a href="/goals" className="text-blue-600 hover:underline">Goals</a></li>
              <li><a href="/debts" className="text-blue-600 hover:underline">Debts</a></li>
              <li><a href="/investments" className="text-blue-600 hover:underline">Investments</a></li>
            </ul>
          </nav>
          <SummaryCards overview={overview} />
          <DashboardCharts overview={overview} />
          <RecentActivity overview={overview} />
        </>
      )}
    </div>
  );
};

export default Dashboard;