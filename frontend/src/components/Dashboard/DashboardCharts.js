import PropTypes from 'prop-types';
import InvestmentChart from '../Investments/InvestmentChart';

const DashboardCharts = ({ overview }) => {
  const recentInvestments = overview?.investments?.recentInvestments || [];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Portfolio Overview</h2>
      {recentInvestments.length === 0 ? (
        <p className="text-gray-500">No recent investments to display.</p>
      ) : (
        <InvestmentChart investments={recentInvestments} chartType="type" />
      )}
    </div>
  );
};

DashboardCharts.propTypes = {
  overview: PropTypes.object.isRequired,
};

export default DashboardCharts;