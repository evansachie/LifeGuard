import { Line } from 'react-chartjs-2';
import { formatDate } from '../../utils/formatDate';

const MetricsHistory = ({ history = [], isDarkMode }) => {
  if (!Array.isArray(history) || history.length < 2) {
    return null;
  }

  const hasValidData = history.every(
    (item) =>
      typeof item.Weight === 'number' &&
      typeof item.BMR === 'number' &&
      typeof item.TDEE === 'number' &&
      item.CreatedAt
  );

  if (!hasValidData) {
    return null;
  }

  const chartData = {
    labels: history.map((m) => formatDate(m.CreatedAt)),
    datasets: [
      {
        label: 'Weight',
        data: history.map((m) => m.Weight),
        borderColor: '#4285F4',
        tension: 0.4,
      },
      {
        label: 'BMR',
        data: history.map((m) => m.BMR),
        borderColor: '#34A853',
        tension: 0.4,
      },
      {
        label: 'TDEE',
        data: history.map((m) => m.TDEE),
        borderColor: '#EA4335',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="metrics-history-section">
      <h3>Metrics History</h3>
      <div className="metrics-chart" style={{ height: '300px', marginTop: '20px' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                grid: {
                  color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                ticks: {
                  color: isDarkMode ? '#fff' : '#666',
                },
              },
              x: {
                grid: {
                  color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                ticks: {
                  color: isDarkMode ? '#fff' : '#666',
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: isDarkMode ? '#fff' : '#666',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MetricsHistory;
