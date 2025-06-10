import { memo, ReactNode } from 'react';
import { IconType } from 'react-icons';

interface DataCardProps {
  title: string;
  value?: string | number;
  unit?: string;
  icon?: IconType;
  className?: string;
  valueColor?: string | null;
  children?: ReactNode;
  onRefresh?: () => void;
  isLive?: boolean;
  lastUpdated?: string;
}

const DataCard = ({
  title,
  value,
  unit,
  icon: Icon,
  className = '',
  valueColor = null,
  children,
  onRefresh,
  isLive = false,
  lastUpdated,
}: DataCardProps) => {
  return (
    <div className={`dashboard-card ${className} ${isLive ? 'live-data' : ''}`}>
      <div className="card-header">
        <h2>
          {Icon && <Icon aria-hidden="true" />} {title}
          {isLive && (
            <span className="live-indicator" title="Real-time data">
              🔴
            </span>
          )}
        </h2>
        {onRefresh && (
          <button onClick={onRefresh} className="refresh-btn" aria-label={`Refresh ${title} data`}>
            ⟳
          </button>
        )}
      </div>
      {children || (
        <>
          <div className="card-value" style={valueColor ? { color: valueColor } : {}}>
            {value}
            {unit}
          </div>
          {lastUpdated && (
            <div className="last-updated">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(DataCard);
