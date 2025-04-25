import ReportHeader from './ReportHeader';
import SummaryCards from './SummaryCards';
import { exportToCSV } from '../../utils/exportUtils';

const ReportsSection = ({ dateRange, onDateRangeChange, historicalData }) => (
  <div className="reports-section">
    <ReportHeader dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
    <SummaryCards historicalData={historicalData} />
    <div className="export-section">
      <h3>Data Export</h3>
      <button className="export-btn" onClick={() => exportToCSV(historicalData)}>
        Export as CSV
      </button>
    </div>
  </div>
);

export default ReportsSection;
