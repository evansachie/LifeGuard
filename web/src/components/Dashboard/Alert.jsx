import React from 'react';

const Alert = ({ alert }) => {
  return (
    <div className={`alert-item ${alert.type}`}>
      <div className="alert-message">{alert.message}</div>
      <div className="alert-time">{alert.time}</div>
    </div>
  );
};

export default Alert;
