import React from 'react';
import ReportHeader from './ReportHeader';
import SummaryCards from './SummaryCards';
import { exportToCSV } from '../../utils/exportUtils';
import { HistoricalData } from '../../hooks/useSensorHistory';

interface ReportsSectionProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  historicalData: HistoricalData;
  isDarkMode?: boolean;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ 
  dateRange, 
  onDateRangeChange, 
  historicalData,
  isDarkMode = false
}) => (
  <div className="reports-section">
    <ReportHeader 
      dateRange={dateRange} 
      onDateRangeChange={onDateRangeChange} 
      isDarkMode={isDarkMode}
    />
    <SummaryCards 
      historicalData={historicalData} 
      isDarkMode={isDarkMode}
    />
    <div className="export-section">
      <h3 className={isDarkMode ? 'text-white' : 'text-gray-800'}>Data Export</h3>
      <button 
        className={`export-btn px-4 py-2 rounded-md ${
          isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
        } hover:bg-blue-700 transition-colors`} 
        onClick={() => exportToCSV(historicalData)}
      >
        Export as CSV
      </button>
    </div>
  </div>
);

export default ReportsSection;
