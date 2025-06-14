import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

export default function DebtChart({ debts }) {
  const data = {
    datasets: [
      {
        label: 'Total Debt',
        data: debts.flatMap(d =>
          [
            { x: d.createdAt, y: d.initialBalance || d.balance },
            ...d.paymentHistory.map(p => ({ x: p.date, y: d.balance + p.amount })),
            { x: new Date(), y: d.balance },
          ]
        ),
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { type: 'time', time: { unit: 'month' } },
      y: { beginAtZero: false, title: { display: true, text: 'Amount ($)' } },
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Total Debt Over Time' },
    },
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Debt Trends</h3>
      {debts.length ? (
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      ) : (
        <p className="text-gray-500">No debt data available</p>
      )}
    </div>
  );
}