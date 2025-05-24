import React from 'react';
import { Alert as AlertType } from '../../types/common.types';

interface AlertProps {
  alert: AlertType;
}

const Alert: React.FC<AlertProps> = ({ alert }) => {
  return (
    <div className={`alert-item ${alert.type}`}>
      <div className="alert-message">{alert.message}</div>
      <div className="alert-time">{alert.time}</div>
    </div>
  );
};

export default Alert;
