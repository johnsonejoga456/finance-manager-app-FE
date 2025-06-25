import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';

const investmentTypes = ['stock', 'bond', 'mutual fund', 'ETF', 'real estate', 'crypto'];

const COLORS = [
  'rgba(59, 130, 246, 0.8)',  // Blue
  'rgba(16, 185, 129, 0.8)',  // Green
  'rgba(245, 158, 11, 0.8)',  // Amber
  'rgba(239, 68, 68, 0.8)',   // Red
  'rgba(139, 92, 246, 0.8)',  // Violet
  'rgba(34, 197, 94, 0.8)',   // Emerald
];

const InvestmentChart = ({ investments, chartType }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(investments) || investments.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    // Cleanup previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    let config = {};

    if (chartType === 'time') {
      // Line Chart: Total Portfolio Value over time
      const sorted = [...investments].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
      const labels = sorted.map(inv => new Date(inv.purchaseDate).toLocaleDateString());
      const values = sorted.reduce((acc, inv, idx) => {
        const prev = idx > 0 ? acc[idx - 1] : 0;
        return [...acc, prev + (inv.currentValue || 0)];
      }, []);

      config = {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Portfolio Value ($)',
            data: values,
            borderColor: COLORS[0],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Date' } },
            y: { title: { display: true, text: 'Value ($)' }, beginAtZero: true },
          },
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Portfolio Growth Over Time' },
          },
        },
      };
    } else {
      // Pie Chart: Value distribution by investment type
      const typeTotals = investmentTypes.reduce((acc, type) => {
        const total = investments
          .filter(inv => inv.type === type)
          .reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
        if (total > 0) acc[type] = total;
        return acc;
      }, {});

      const labels = Object.keys(typeTotals);
      const data = labels.map(type => typeTotals[type]);

      config = {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: COLORS.slice(0, labels.length),
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Portfolio by Investment Type' },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  return `$${value.toFixed(2)}`;
                },
              },
            },
          },
        },
      };
    }

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [investments, chartType]);

  return (
    <div className="bg-white shadow rounded-md border p-4 mb-6">
      <canvas ref={chartRef} className="w-full h-96" />
    </div>
  );
};

InvestmentChart.propTypes = {
  investments: PropTypes.array.isRequired,
  chartType: PropTypes.oneOf(['time', 'type']).isRequired,
};

export default InvestmentChart;
