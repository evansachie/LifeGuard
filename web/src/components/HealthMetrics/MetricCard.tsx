import React, { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description?: string;
}

const MetricCard = ({ icon, title, value, description }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="metric-icon-container">{icon}</div>
      <div className="metric-content">
        <h3>{title}</h3>
        <p className="metric-value">{value}</p>
        {description && <p className="metric-description">{description}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
