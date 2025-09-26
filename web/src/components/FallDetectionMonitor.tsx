import { useBLE } from '../contexts/BLEContext';
import { AlertTriangle, Shield, Activity } from 'lucide-react';

const FallDetectionMonitor = () => {
  const { fallAlert, latestSensorData, connectedDevice } = useBLE();

  if (!connectedDevice) {
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Fall Detection</h3>
            <p className="text-sm text-gray-500">Connect to LifeGuard device to monitor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg p-4 ${
          fallAlert.detected
            ? 'bg-red-100 border border-red-300'
            : 'bg-green-100 border border-green-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          {fallAlert.detected ? (
            <AlertTriangle className="h-6 w-6 text-red-600" />
          ) : (
            <Shield className="h-6 w-6 text-green-600" />
          )}
          <div>
            <h3
              className={`text-lg font-semibold ${
                fallAlert.detected ? 'text-red-800' : 'text-green-800'
              }`}
            >
              {fallAlert.detected ? '🚨 FALL DETECTED!' : '✅ Monitoring Active'}
            </h3>
            <p className={`text-sm ${fallAlert.detected ? 'text-red-700' : 'text-green-700'}`}>
              {fallAlert.detected
                ? `Fall detected at ${fallAlert.timestamp?.toLocaleTimeString()}`
                : 'Real-time fall detection is running'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-800">Current Activity</h4>
            <p className="text-sm text-blue-700">
              ML Inference: {fallAlert.activityInference || 'Processing...'}
            </p>
            <p className="text-sm text-blue-600">
              Motion Status: {latestSensorData.motion?.activity || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Sensor Data</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Accelerometer:</span>
            <div className="text-gray-800">
              X: {latestSensorData.motion?.accelerometer?.x?.toFixed(2) || '0.00'}g
            </div>
            <div className="text-gray-800">
              Y: {latestSensorData.motion?.accelerometer?.y?.toFixed(2) || '0.00'}g
            </div>
            <div className="text-gray-800">
              Z: {latestSensorData.motion?.accelerometer?.z?.toFixed(2) || '0.00'}g
            </div>
          </div>
          <div>
            <span className="text-gray-600">Gyroscope:</span>
            <div className="text-gray-800">
              X: {latestSensorData.motion?.gyroscope?.x?.toFixed(2) || '0.00'}°/s
            </div>
            <div className="text-gray-800">
              Y: {latestSensorData.motion?.gyroscope?.y?.toFixed(2) || '0.00'}°/s
            </div>
            <div className="text-gray-800">
              Z: {latestSensorData.motion?.gyroscope?.z?.toFixed(2) || '0.00'}°/s
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-gray-600">Step Count: </span>
          <span className="text-gray-800">{latestSensorData.motion?.stepCount || 0}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Connected Device:</span>
          <span className="text-gray-800 font-medium">{connectedDevice.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Last Update:</span>
          <span className="text-gray-800">
            {latestSensorData.timestamp
              ? new Date(latestSensorData.timestamp).toLocaleTimeString()
              : 'No data'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FallDetectionMonitor;
