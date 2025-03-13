import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { legendItems } from '../../data/legend-items';

const Legend = () => (
  <div className="legend">
    <h3>
      <FaInfoCircle /> Pollution Levels
    </h3>
    {legendItems.map((item, index) => (
      <div key={index} className="legend-item">
        <div className="legend-color" style={{ backgroundColor: item.color }} />
        <div className="legend-info">
          <span className="legend-label">{item.label}</span>
          <span className="legend-description">{item.description}</span>
        </div>
      </div>
    ))}
  </div>
);

export default Legend;
