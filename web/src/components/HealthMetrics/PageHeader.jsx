import React from 'react';
import UnitToggle from './UnitToggle';

const PageHeader = ({ unit, setUnit }) => (
    <div className="header-section">
        <h2>Health Metrics Calculator</h2>
        <UnitToggle unit={unit} setUnit={setUnit} />
    </div>
);

export default PageHeader;