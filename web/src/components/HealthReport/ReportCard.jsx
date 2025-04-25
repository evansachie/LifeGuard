import { FaFileAlt } from 'react-icons/fa';

export const ReportCard = ({ date, type, status }) => (
  <div className="report-card">
    <div className="report-card-left">
      <div className="report-icon">
        <FaFileAlt />
      </div>
      <div className="report-info">
        <h3 className="report-title">{type}</h3>
        <p className="report-date">{date}</p>
      </div>
    </div>
    <div
      className="report-status"
      style={{ '--status-color': status === 'Normal' ? '#4CAF50' : '#FF9800' }}
    >
      {status}
    </div>
  </div>
);
