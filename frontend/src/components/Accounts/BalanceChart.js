import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

export default function BalanceChart({ transactions }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !transactions) return;

    const ctx = chartRef.current.getContext('2d');
    const dates = transactions.map((tx) => new Date(tx.date).toLocaleDateString());
    const balances = transactions.reduce((acc, tx, idx) => {
      const prevBalance = idx === 0 ? 0 : acc[idx - 1];
      acc.push(prevBalance + (tx.type === 'income' ? tx.amount : -tx.amount));
      return acc;
    }, []);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Balance Over Time',
            data: balances,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Date' },
          },
          y: {
            title: { display: true, text: 'Balance ($)' },
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div className="bg-white shadow-sm rounded-md border p-4 mb-4">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">Balance Trend</h4>
      <canvas ref={chartRef} />
    </div>
  );
}

BalanceChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};