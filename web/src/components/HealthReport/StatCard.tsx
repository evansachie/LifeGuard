import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
  icon: IconType;
  label: string;
  value: string | number;
  color: string;
}

export const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="stat-card" style={{ '--card-color': color } as React.CSSProperties}>
    <div className="stat-icon">
      <Icon />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);
