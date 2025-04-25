import EnvironmentCharts from './EnvironmentCharts';
import AirQualityCharts from './AirQualityCharts';
import ReportsSection from './ReportsSection';

const TabContent = ({ activeTab, historicalData, dateRange, onDateRangeChange }) => {
  const chartOptions = { responsive: true };

  const tabComponents = {
    environment: (
      <div className="section">
        <h2>Environmental Conditions</h2>
        <EnvironmentCharts historicalData={historicalData} chartOptions={chartOptions} />
      </div>
    ),
    airQuality: (
      <div className="section">
        <h2>Air Quality Analysis</h2>
        <AirQualityCharts historicalData={historicalData} chartOptions={chartOptions} />
      </div>
    ),
    reports: (
      <div className="section">
        <h2>Analytics Reports</h2>
        <ReportsSection
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          historicalData={historicalData}
        />
      </div>
    ),
  };

  return tabComponents[activeTab] || null;
};

export default TabContent;
