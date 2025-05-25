import ProactiveHealth from '../assets/health-monitor.svg';
import Environmental from '../assets/nature.svg';
import Emergency from '../assets/emergency.svg';

export interface Benefit {
  title: string;
  description: string;
  image: string;
}

export const benefits: Benefit[] = [
  {
    title: 'Proactive Health Monitoring',
    description: 'Stay ahead of health issues with real-time monitoring and early warning systems.',
    image: ProactiveHealth,
  },
  {
    title: 'Environmental Awareness',
    description: 'Understand your surroundings with detailed environmental quality metrics.',
    image: Environmental,
  },
  {
    title: 'Emergency Response',
    description: 'Quick access to emergency services and automated alerts to emergency contacts.',
    image: Emergency,
  },
];