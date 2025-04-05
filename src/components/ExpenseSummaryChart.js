import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseSummaryChart = ({ 
  data, 
  type = 'line', 
  title = 'Expense Summary',
  labels = [],
  timeframe = 'monthly' // 'monthly' or 'annual'
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartLabels = timeframe === 'monthly' 
    ? (labels.length > 0 ? labels : months)
    : (labels.length > 0 ? labels : data.map(item => item.year));
  
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Expenses (SP)',
        data: timeframe === 'monthly' 
          ? data 
          : data.map(item => item.total),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M SP';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K SP';
            }
            return value + ' SP';
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      {type === 'line' ? (
        <Line options={options} data={chartData} />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  );
};

export default ExpenseSummaryChart;
