import React from 'react';
import { FaTemperatureHigh, FaTint, FaWalking, FaChartLine } from 'react-icons/fa';
import { WiBarometer } from 'react-icons/wi';
import { MdAir } from 'react-icons/md';
import { UserData } from '../types/common.types';

interface VitalMetric {
  average: string;
  min: string;
  max: string;
  status: string;
}

interface AirQualityMetric {
  average: string;
  status: string;
  pollutants: {
    pm25: string;
    pm10: string;
    no2: string;
  };
}

interface EnvironmentalMetric {
  average: string;
  status: string;
}

interface ActivityMetric {
  average: string;
  goal: string;
  status: string;
}

export interface HealthReportData {
  userInfo: {
    name: string;
    date: string;
    reportId: string;
  };
  vitals: {
    temperature: VitalMetric;
    pressure: VitalMetric;
    humidity: VitalMetric;
    activityLevel: VitalMetric;
  };
  environmentalMetrics: {
    airQuality: AirQualityMetric;
    humidity: EnvironmentalMetric;
    pressure: EnvironmentalMetric;
  };
  activityMetrics: {
    dailySteps: ActivityMetric;
    caloriesBurned: ActivityMetric;
    activeMinutes: ActivityMetric;
  };
  recommendations: string[];
}

interface HealthStat {
  icon: React.ComponentType;
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

export const generateHealthReport = (userData?: UserData): HealthReportData => ({
  userInfo: {
    name: userData?.userName || 'Test User',
    date: new Date().toLocaleDateString(),
    reportId: `LGR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  },
  vitals: {
    temperature: {
      average: '36.5°C',
      min: '36.2°C',
      max: '36.8°C',
      status: 'Normal',
    },
    pressure: {
      average: '1000hPa',
      min: '500hPa',
      max: '1500hPa',
      status: 'Normal',
    },
    humidity: {
      average: '50%',
      min: '45%',
      max: '55%',
      status: 'Normal',
    },
    activityLevel: {
      average: '200 steps',
      min: '100 steps',
      max: '300 steps',
      status: 'low',
    },
  },
  environmentalMetrics: {
    airQuality: {
      average: '75 AQI',
      status: 'Moderate',
      pollutants: {
        pm25: '15.2 µg/m³',
        pm10: '45.8 µg/m³',
        no2: '25.4 ppb',
      },
    },
    humidity: {
      average: '58.8%',
      status: 'Optimal',
    },
    pressure: {
      average: '1013 hPa',
      status: 'Normal',
    },
  },
  activityMetrics: {
    dailySteps: {
      average: '8,500',
      goal: '10,000',
      status: 'Good',
    },
    caloriesBurned: {
      average: '2,150 kcal',
      goal: '2,500 kcal',
      status: 'On Track',
    },
    activeMinutes: {
      average: '45 mins',
      goal: '60 mins',
      status: 'Improving',
    },
  },
  recommendations: [
    'Maintain regular physical activity levels',
    'Consider increasing daily water intake',
    'Monitor PM2.5 exposure during outdoor activities',
    'Keep up with the consistent sleep schedule',
  ],
});

export const healthData: HealthData = {
  stats: [
    { icon: FaTemperatureHigh, label: 'Temperature', value: '30°C', color: '#FF6B6B' },
    { icon: FaTint, label: 'Humidity', value: '58.8%', color: '#4A90E2' },
    { icon: WiBarometer, label: 'Pressure', value: '1013 hPa', color: '#9B51E0' },
    { icon: FaWalking, label: 'Steps', value: '1.2K', color: '#F5A623' },
    { icon: MdAir, label: 'Air Quality', value: '75 AQI', color: '#2ECC71' },
    { icon: FaChartLine, label: 'Activity', value: '+15%', color: '#1ABC9C' },
  ],
  reports: [
    { id: 1, date: 'Jul 10, 2023', type: 'General Health Report', status: 'Normal' },
    { id: 2, date: 'Jul 5, 2023', type: 'Air Quality Report', status: 'Warning' },
    { id: 3, date: 'Jul 1, 2023', type: 'Activity Report', status: 'Normal' },
  ],
};