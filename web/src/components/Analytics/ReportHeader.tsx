import React from 'react';
import { DATE_RANGES } from '../../utils/constants';

interface ReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  isDarkMode?: boolean;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ dateRange, onDateRangeChange, isDarkMode = false }) => (
  <div className="report-header">
    <h3 className={isDarkMode ? 'text-white' : 'text-gray-800'}>Current Status</h3>
    <div className="date-range">
      <select
        className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
      >
        {DATE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ReportHeader;
