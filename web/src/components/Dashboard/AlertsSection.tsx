import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Alert as AlertType } from '../../types/common.types';
import Alert from './Alert';

interface AlertsSectionProps {
  alerts: AlertType[];
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts }) => {
  return (
    <div className="dashboard-card alerts-section">
      <h2>
        <FaExclamationTriangle /> Recent Alerts
      </h2>
      <div className="alerts-list">
        {alerts.map((alert) => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;
