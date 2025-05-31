import React from 'react';
import UnitToggle from './UnitToggle';

interface PageHeaderProps {
  unit: 'metric' | 'imperial';
  setUnit: (unit: 'metric' | 'imperial') => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ unit, setUnit }) => (
  <div className="header-section">
    <h2>Health Metrics Calculator</h2>
    <UnitToggle unit={unit} setUnit={setUnit} />
  </div>
);

export default PageHeader;
