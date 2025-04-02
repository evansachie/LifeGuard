import React from 'react';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';

const MetricsHistory = ({ history, isDarkMode, unit }) => {
    if (!history?.length) return null;

    const chartData = {
        labels: history.map(m => format(new Date(m.CreatedAt), 'MMM d')),
        datasets: [
            {
                label: 'Weight',
                data: history.map(m => m.Weight),
                borderColor: '#4285F4',
                tension: 0.4
            },
            {
                label: 'BMR',
                data: history.map(m => m.BMR),
                borderColor: '#34A853',
                tension: 0.4
            },
            {
                label: 'TDEE',
                data: history.map(m => m.TDEE),
                borderColor: '#EA4335',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="metrics-history-section">
            <h3>Metrics History</h3>
            <div className="metrics-chart">
                <Line 
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false,
                                grid: {
                                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                },
                                ticks: {
                                    color: isDarkMode ? '#fff' : '#666'
                                }
                            },
                            x: {
                                grid: {
                                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                },
                                ticks: {
                                    color: isDarkMode ? '#fff' : '#666'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: isDarkMode ? '#fff' : '#666'
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MetricsHistory;
