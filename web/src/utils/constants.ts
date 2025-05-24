import { FaWind, FaChartLine } from 'react-icons/fa';
import { MdAir } from 'react-icons/md';
import { IconType } from 'react-icons';

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  description: string;
}

interface DateRange {
  value: string;
  label: string;
}

export const TABS: Tab[] = [
  {
    id: 'environment',
    label: 'Environment',
    icon: FaWind,
    description: 'Temperature, Humidity, and Pressure trends',
  },
  {
    id: 'airQuality',
    label: 'Air Quality',
    icon: MdAir,
    description: 'CO2 and Gas composition analysis',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FaChartLine,
    description: 'Data analysis and insights',
  },
];

export const DATE_RANGES: DateRange[] = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];
