import PropTypes from 'prop-types';

const RecentActivity = ({ overview }) => {
  const recentTransactions = overview?.transactions?.recent || [];
  const recentInvestments = overview?.investments?.recentInvestments || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <div className="bg-white rounded shadow p-4">
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500">No recent transactions.</p>
          ) : (
            <ul className="space-y-2">
              {recentTransactions.slice(0, 5).map((tx) => (
                <li key={tx._id} className="flex justify-between border-b pb-1">
                  <span>{tx.notes || tx.category || 'Transaction'}</span>
                  <span>${tx.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Investments</h2>
        <div className="bg-white rounded shadow p-4">
          {recentInvestments.length === 0 ? (
            <p className="text-gray-500">No recent investments.</p>
          ) : (
            <ul className="space-y-2">
              {recentInvestments.slice(0, 5).map((inv) => (
                <li key={inv._id} className="flex justify-between border-b pb-1">
                  <span>{inv.name}</span>
                  <span>${inv.currentValue.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  overview: PropTypes.object.isRequired,
};

export default RecentActivity;