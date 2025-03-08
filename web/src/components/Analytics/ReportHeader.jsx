import React from 'react';
import { DATE_RANGES } from '../../utils/constants';

const ReportHeader = ({ dateRange, onDateRangeChange }) => (
    <div className="report-header">
        <h3>Current Status</h3>
        <div className="date-range">
            <select 
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
            >
                {DATE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>
                        {range.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default ReportHeader; 