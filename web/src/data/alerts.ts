import type { Alert } from '../types/common.types';

/**
 * Static alert data for the dashboard
 * In a real app, this would come from an API
 */
export const alerts: Alert[] = [
  {
    id: 1,
    type: 'warning' as const,
    message: 'High PM2.5 levels detected in your area',
    time: '2 hours ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'info' as const,
    message: 'Air quality has improved since yesterday',
    time: '5 hours ago',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'warning' as const,
    message: 'Humidity levels exceeding recommended range',
    time: '1 day ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Get alerts filtered by type
 * @param type - Alert type to filter by
 * @returns Filtered alerts
 */
export const getAlertsByType = (type: Alert['type']): Alert[] => {
  return alerts.filter((alert) => alert.type === type);
};

/**
 * Get alerts from a specific time period
 * @param timeframe - Timeframe to filter by (today, week, month)
 * @returns Filtered alerts
 */
export const getAlertsByTimeframe = (timeframe: string): Alert[] => {
  const now = new Date();

  switch (timeframe) {
    case 'today':
      const today = new Date(now.setHours(0, 0, 0, 0));
      return alerts.filter((alert) => new Date(alert.timestamp) >= today);

    case 'week':
      const week = new Date(now.setDate(now.getDate() - 7));
      return alerts.filter((alert) => new Date(alert.timestamp) >= week);

    case 'month':
      const month = new Date(now.setMonth(now.getMonth() - 1));
      return alerts.filter((alert) => new Date(alert.timestamp) >= month);

    default:
      return alerts;
  }
};
