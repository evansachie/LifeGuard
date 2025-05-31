import React from 'react';

export interface Tab {
  id: 'environment' | 'airQuality' | 'reports';
  label: string;
  icon: React.ReactNode;
}

export interface TabNavigationProps {
  activeTab: 'environment' | 'airQuality' | 'reports';
  onTabChange: (tab: 'environment' | 'airQuality' | 'reports') => void;
  tabs: Tab[];
}

const TabNavigation = ({ activeTab, onTabChange, tabs }: TabNavigationProps) => (
  <div className="tabs">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.icon}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

export default TabNavigation;
