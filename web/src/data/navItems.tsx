import { FaHome, FaStickyNote, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { TbReportAnalytics } from 'react-icons/tb';
import {
  MdContactEmergency,
  MdHealthAndSafety,
  MdOutlineAnalytics,
  MdMedication,
} from 'react-icons/md';
import { FaMap } from 'react-icons/fa';
import { NavigationItem } from '../types/common.types';

export const navItems: NavigationItem[] = [
  { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
  { path: '/analytics', icon: <MdOutlineAnalytics />, label: 'Analytics' },
  { path: '/sticky-notes', icon: <FaStickyNote />, label: 'Sticky Notes' },
  { path: '/health-report', icon: <TbReportAnalytics />, label: 'Health Report' },
  { path: '/pollution-tracker', icon: <FaMap />, label: 'Pollution Tracker' },
  { path: '/medication-tracker', icon: <MdMedication />, label: 'Medication Tracker' },
  { path: '/health-tips', icon: <MdHealthAndSafety />, label: 'Health Tips' },
  { path: '/emergency-contacts', icon: <MdContactEmergency />, label: 'Emergency Contacts' },
  { path: '/settings', icon: <FaCog />, label: 'Settings' },
  { path: '/help', icon: <FaQuestionCircle />, label: 'Help' },
];