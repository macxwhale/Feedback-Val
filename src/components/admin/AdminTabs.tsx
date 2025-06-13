
import React from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'organizations', label: 'Organizations', icon: Users },
    { id: 'stats', label: 'System Statistics', icon: BarChart3 },
    { id: 'config', label: 'System Configuration', icon: Settings },
  ];

  return (
    <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </button>
      ))}
    </div>
  );
};
