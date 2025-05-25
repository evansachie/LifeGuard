import React from 'react';

export interface Tab {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => (
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
