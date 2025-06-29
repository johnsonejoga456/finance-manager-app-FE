import PropTypes from 'prop-types';

const SummaryCards = ({ overview }) => {
  if (!overview) {
    return <p className="text-center text-gray-500">Loading dashboard summary...</p>;
  }

  const totalAccountsBalance = overview.accounts?.totalBalance ?? 0;
  const totalTransactions = overview.transactions?.recent?.length ?? 0;
  const totalBudgets = overview.budgets?.activeBudgets?.length ?? 0;
  const totalGoals = overview.goals?.activeGoals?.length ?? 0;
  const totalDebts = overview.debts?.totalDebt ?? 0;
  const totalInvestmentsValue = overview.investments?.totalValue ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Accounts Balance</h3>
        <p className="text-xl font-semibold">${totalAccountsBalance.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Recent Transactions</h3>
        <p className="text-xl font-semibold">{totalTransactions}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Active Budgets</h3>
        <p className="text-xl font-semibold">{totalBudgets}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Active Goals</h3>
        <p className="text-xl font-semibold">{totalGoals}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Total Debt</h3>
        <p className="text-xl font-semibold">${totalDebts.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-600">Investments Value</h3>
        <p className="text-xl font-semibold">${totalInvestmentsValue.toFixed(2)}</p>
      </div>
    </div>
  );
};

SummaryCards.propTypes = {
  overview: PropTypes.object,
};

export default SummaryCards;