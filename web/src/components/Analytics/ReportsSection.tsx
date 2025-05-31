import ReportHeader from './ReportHeader';
import SummaryCards from './SummaryCards';
import { exportToCSV } from '../../utils/exportUtils';
import { HistoricalData } from '../../hooks/useSensorHistory';

type DateRangeType = '24h' | '7d' | '30d' | '90d';

export interface ReportsSectionProps {
  dateRange: DateRangeType;
  onDateRangeChange: (range: DateRangeType) => void;
  historicalData: HistoricalData;
  isDarkMode?: boolean;
}

const ReportsSection = ({
  dateRange,
  onDateRangeChange,
  historicalData,
  isDarkMode = false,
}: ReportsSectionProps) => (
  <div className="reports-section space-y-6">
    <ReportHeader
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      isDarkMode={isDarkMode}
      title="Analytics Reports"
      description="Summary of sensor data and trends over the selected time period."
    />

    <SummaryCards historicalData={historicalData} isDarkMode={isDarkMode} />

    <div
      className={`export-section mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
    >
      <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Data Export
      </h3>
      <button
        className={`export-btn px-4 py-2 rounded-md ${
          isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
        } hover:bg-blue-700 transition-colors flex items-center gap-2`}
        onClick={() => exportToCSV(historicalData)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
        </svg>
        Export as CSV
      </button>
    </div>
  </div>
);

export default ReportsSection;
