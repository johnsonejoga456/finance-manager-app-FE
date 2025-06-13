import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetChart({ budgetInsights }) {
  const chartData = {
    labels: budgetInsights.categories,
    datasets: [
      {
        label: 'Spent',
        data: budgetInsights.spending.map(s => s.spent),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 4,
      },
      {
        label: 'Budgeted',
        data: budgetInsights.spending.map(s => s.budgeted),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'].map(c => `${c}80`),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Budget Insights</h3>
      {budgetInsights.categories.length ? (
        <div className="h-64">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Budget vs. Spending by Category' },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-gray-500">No insights available</p>
      )}
    </div>
  );
}