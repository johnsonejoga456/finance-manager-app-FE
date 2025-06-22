import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';

const InvestmentChart = ({ investments, chartType }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(investments) || investments.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    let chartConfig = {};

    if (chartType === 'time') {
      // Line chart: Portfolio value over time
      const sortedInvestments = [...investments].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
      const dates = sortedInvestments.map(inv => new Date(inv.purchaseDate).toLocaleDateString());
      const values = sortedInvestments.reduce((acc, inv, idx) => {
        const prevValue = idx > 0 ? acc[idx - 1] : 0;
        return [...acc, prevValue + (inv.currentValue || 0)];
      }, []);

      chartConfig = {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Portfolio Value ($)',
            data: values,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Purchase Date' } },
            y: { title: { display: true, text: 'Value ($)' }, beginAtZero: true },
          },
        },
      };
    } else {
      // Pie chart: Value by type
      const typeTotals = investmentTypes.reduce((acc, type) => {
        const total = investments
          .filter(inv => inv.type === type)
          .reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
        return { ...acc, [type]: total };
      }, {});
      const labels = Object.keys(typeTotals).filter(type => typeTotals[type] > 0);
      const data = labels.map(type => typeTotals[type]);

      chartConfig = {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)',
            ],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Portfolio by Investment Type' },
          },
        },
      };
    }

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [investments, chartType]);

  return (
    <div className="bg-white shadow-sm rounded-md border p-4 mb-4">
      <canvas ref={chartRef} />
    </div>
  );
};

InvestmentChart.propTypes = {
  investments: PropTypes.array.isRequired,
  chartType: PropTypes.oneOf(['time', 'type']).isRequired,
};

const investmentTypes = ['stock', 'bond', 'mutual fund', 'ETF', 'real estate', 'crypto'];

export default InvestmentChart;