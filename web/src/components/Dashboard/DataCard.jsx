import React, { memo } from 'react';
import PropTypes from 'prop-types';

const DataCard = ({
  title,
  value,
  unit,
  icon: Icon,
  className = '',
  valueColor = null,
  children,
  onRefresh = null,
}) => {
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

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  valueColor: PropTypes.string,
  children: PropTypes.node,
  onRefresh: PropTypes.func,
};

export default memo(DataCard);
