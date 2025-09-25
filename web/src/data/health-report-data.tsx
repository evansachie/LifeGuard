import { FaTemperatureHigh, FaTint, FaWalking } from 'react-icons/fa';
import { WiBarometer } from 'react-icons/wi';
import { MdAir } from 'react-icons/md';
import { IconType } from 'react-icons';

export interface HealthReportData {
  userInfo: {
    reportId: string;
    date: string;
    name: string;
  };
  vitals: Record<string, any>;
  environmentalMetrics: Record<string, any>;
  activityMetrics: Record<string, any>;
  recommendations: string[];
}

interface HealthStat {
  icon: IconType;
  label: string;
  value: string;
  color: string;
}

interface ReportItem {
  id: number;
  date: string;
  type: string;
  status: string;
}

interface HealthData {
  stats: HealthStat[];
  reports: ReportItem[];
}

export const generateHealthReport = async (userData: any): Promise<HealthReportData> => {
  return new Promise((resolve) => {
    // Generate basic mock report
    const reportId = `LG-${Date.now()}`;
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mockReport: HealthReportData = {
      userInfo: {
        reportId,
        date: reportDate,
        name: userData?.name || localStorage.getItem('userName') || 'LifeGuard User',
      },
      vitals: {
        heartRate: { average: '72 BPM', min: '65 BPM', max: '85 BPM', status: 'Normal' },
        bloodPressure: {
          average: '120/80 mmHg',
          min: '110/70 mmHg',
          max: '130/85 mmHg',
          status: 'Normal',
        },
        bodyTemperature: { average: '36.8°C', min: '36.5°C', max: '37.1°C', status: 'Normal' },
        oxygenSaturation: { average: '98%', min: '96%', max: '99%', status: 'Normal' },
      },
      environmentalMetrics: {
        airQuality: { average: 'Good (45 AQI)', status: 'Good' },
        temperature: { average: '24°C', status: 'Optimal' },
        humidity: { average: '55%', status: 'Comfortable' },
        pressure: { average: '1013 hPa', status: 'Normal' },
      },
      activityMetrics: {
        stepCount: { average: '8,500', status: 'Good', goal: '10,000 steps' },
        caloriesBurned: { average: '450', status: 'On track', goal: '500 calories' },
        activeMinutes: { average: '35', status: 'Good', goal: '30 minutes' },
      },
      recommendations: [
        'Maintain your current activity level',
        'Stay hydrated throughout the day',
        'Consider adding more vegetables to your diet',
        'Ensure 7-8 hours of quality sleep',
      ],
    };

    // Simulate async operation
    setTimeout(() => resolve(mockReport), 100);
  });
};

export const healthData: HealthData = {
  stats: [
    { icon: FaTemperatureHigh, label: 'Temperature', value: '30°C', color: '#FF6B6B' },
    { icon: FaTint, label: 'Humidity', value: '58.8%', color: '#4A90E2' },
    { icon: WiBarometer, label: 'Pressure', value: '1013 hPa', color: '#9B51E0' },
    { icon: FaWalking, label: 'Steps', value: '1.2K', color: '#F5A623' },
    { icon: MdAir, label: 'Air Quality', value: '75 AQI', color: '#2ECC71' },
  ],
  reports: [
    { id: 1, date: 'Jul 10, 2025', type: 'General Health Report', status: 'Normal' },
    { id: 2, date: 'Jul 5, 2025', type: 'Air Quality Report', status: 'Warning' },
    { id: 3, date: 'Jul 1, 2025', type: 'Activity Report', status: 'Normal' },
  ],
};
