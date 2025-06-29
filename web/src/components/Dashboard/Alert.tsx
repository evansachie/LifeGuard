import { Alert as AlertType } from '../../types/common.types';

interface AlertProps {
  alert: AlertType;
}

const Alert = ({ alert }: AlertProps) => {
  return (
    <div className={`alert-item ${alert.type}`}>
      <div className="alert-message">{alert.message}</div>
      <div className="alert-time">{alert.time}</div>
    </div>
  );
};

export default Alert;
