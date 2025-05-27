import React from 'react';
import { FaInfoCircle, FaUserMd, FaAmbulance } from 'react-icons/fa';

type TabType = 'info' | 'medical' | 'actions';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, isDarkMode }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
          activeTab === 'info'
            ? isDarkMode
              ? 'border-blue-500 text-blue-400'
              : 'border-blue-500 text-blue-600'
            : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300'
              : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('info')}
      >
        <FaInfoCircle className="inline mr-2" /> Information
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
          activeTab === 'medical'
            ? isDarkMode
              ? 'border-red-500 text-red-400'
              : 'border-red-500 text-red-600'
            : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300'
              : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('medical')}
      >
        <FaUserMd className="inline mr-2" /> Medical
      </button>
      <button
        className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
          activeTab === 'actions'
            ? isDarkMode
              ? 'border-green-500 text-green-400'
              : 'border-green-500 text-green-600'
            : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300'
              : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('actions')}
      >
        <FaAmbulance className="inline mr-2" /> Actions
      </button>
    </div>
  );
};

export default TabNavigation;
