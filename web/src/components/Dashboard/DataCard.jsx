import React from 'react';

const DataCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    className = '',
    valueColor = null,
    children
}) => {
    return (
        <div className={`dashboard-card ${className}`}>
            <h2>{Icon && <Icon />} {title}</h2>
            {children || (
                <div className="card-value" style={valueColor ? { color: valueColor } : {}}>
                    {value}{unit}
                </div>
            )}
        </div>
    );
};

export default DataCard;
