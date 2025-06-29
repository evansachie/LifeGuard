type DateRangeType = '24h' | '7d' | '30d' | '90d';

export interface ReportHeaderProps {
  dateRange: DateRangeType;
  onDateRangeChange: (range: DateRangeType) => void;
  isDarkMode?: boolean;
  title?: string;
  description?: string;
}

const ReportHeader = ({
  dateRange,
  onDateRangeChange,
  isDarkMode = false,
  description = 'Summary of environmental conditions and trends over the selected time period.',
}: ReportHeaderProps) => {
  return (
    <div className="report-header mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        {/* <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2> */}
        <div className="date-filter flex items-center">
          <label
            htmlFor="dateRange"
            className={`mr-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Time Period:
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as DateRangeType)}
            className={`border ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            } rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
      <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

export default ReportHeader;
