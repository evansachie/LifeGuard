import React from 'react';
import { WiThermometer } from 'react-icons/wi';
import { MdAir, MdAutoGraph } from 'react-icons/md';

export interface Tab {
  id: 'environment' | 'airQuality' | 'reports';
  label: string;
  icon: React.ReactNode;
}

export const analyticsTabsData: Tab[] = [
  {
    id: 'environment',
    label: 'Environment',
    icon: React.createElement(WiThermometer),
  },
  {
    id: 'airQuality',
    label: 'Air Quality',
    icon: React.createElement(MdAir),
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: React.createElement(MdAutoGraph),
  },
];

// Keep the old TABS for backward compatibility if needed
export const TABS = [
  {
    id: 'environment',
    label: 'Environment',
    icon: WiThermometer,
  },
  {
    id: 'airQuality',
    label: 'Air Quality',
    icon: MdAir,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: MdAutoGraph,
  },
];
