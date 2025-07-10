import { FaBrain, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { MdPsychology } from 'react-icons/md';

interface MLInferenceCardProps {
  activity: string;
  confidence: number;
  fallDetected: boolean;
  isDarkMode?: boolean;
}

const MLInferenceCard = ({
  activity,
  confidence,
  fallDetected,
  isDarkMode = false,
}: MLInferenceCardProps) => {
  const isConnected = confidence > 0;

  const getActivityIcon = () => {
    if (!isConnected) return '🔌';
    switch (activity.toLowerCase()) {
      case 'walking':
        return '🚶';
      case 'running':
        return '🏃';
      case 'sitting':
        return '🪑';
      case 'standing':
        return '🧍';
      case 'lying':
        return '🛏️';
      default:
        return '⏸️';
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };
  const getActivityStatus = () => {
    if (!isConnected) return 'Connect Arduino Device';
    if (fallDetected) return 'EMERGENCY: Fall Detected!';
    return `Current Activity: ${activity.charAt(0).toUpperCase() + activity.slice(1)}`;
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      } ${fallDetected ? 'border-red-500 bg-red-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MdPsychology
            className={`text-xl ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
          />
          <h3 className="font-semibold text-sm">AI Health Monitor</h3>
        </div>
        {fallDetected ? (
          <FaExclamationTriangle className="text-red-500 text-lg animate-pulse" />
        ) : (
          <FaCheckCircle className="text-green-500 text-lg" />
        )}
      </div>

      {/* Activity Display */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getActivityIcon()}</span>
          <div>
            <p
              className={`text-sm font-medium ${
                fallDetected ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {getActivityStatus()}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Edge AI Classification
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Confidence</span>
          <span className={`text-xs font-bold ${getConfidenceColor()}`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              confidence >= 0.8
                ? 'bg-green-500'
                : confidence >= 0.6
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <FaBrain className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Edge Impulse ML</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              confidence > 0.5 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {confidence > 0.5 ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Emergency Alert */}
      {fallDetected && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-md">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-red-600" />
            <span className="text-red-800 text-xs font-medium">
              Emergency services have been notified
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLInferenceCard;
