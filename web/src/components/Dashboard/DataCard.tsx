import React, { memo, ReactNode } from 'react';
import { IconType } from 'react-icons';

interface DataCardProps {
  title: string;
  value?: string | number;
  unit?: string;
  icon?: IconType;
  className?: string;
  valueColor?: string | null;
  children?: ReactNode;
  onRefresh?: () => void | null;
}

const DataCard = ({
  title,
  value,
  unit,
  icon: Icon,
  className = '',
  valueColor = null,
  children,
  onRefresh = null,
}: DataCardProps) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="card-header">
        <h2>
          {Icon && <Icon aria-hidden="true" />} {title}
        </h2>
        {onRefresh && (
          <button onClick={onRefresh} className="refresh-btn" aria-label={`Refresh ${title} data`}>
            ⟳
          </button>
        )}
      </div>
      {children || (
        <div className="card-value" style={valueColor ? { color: valueColor } : {}}>
          {value}
          {unit}
        </div>
      )}
    </div>
  );
};

export default memo(DataCard);
