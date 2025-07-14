
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tabSections } from './DashboardTabSections';
import { RoleBasedTabFilter } from './RoleBasedTabFilter';
import { useOrganization } from '@/context/OrganizationContext';

interface DashboardSidebarProps {
  organizationName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: any;
  isLoading?: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  organizationName,
  activeTab,
  onTabChange,
  stats,
  isLoading
}) => {
  const { organizationId } = useOrganization();

  if (!organizationId) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900 truncate">{organizationName}</h2>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      <RoleBasedTabFilter
        sections={tabSections}
        organizationId={organizationId}
      >
        {(filteredSections) => (
          <nav className="p-4 space-y-6">
            {filteredSections.map((section) => (
              <div key={section.label}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isActive ? "bg-blue-50 text-blue-700 border-blue-200" : ""
                        }`}
                        onClick={() => onTabChange(tab.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                        {stats && tab.id === 'members' && stats.active_members && (
                          <Badge variant="secondary" className="ml-auto">
                            {stats.active_members}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        )}
      </RoleBasedTabFilter>

      {/* Stats Summary */}
      {stats && !isLoading && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Total Sessions:</span>
              <span>{stats.total_sessions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Responses:</span>
              <span>{stats.total_responses || 0}</span>
            </div>
            {stats.avg_session_score && (
              <div className="flex justify-between">
                <span>Avg Score:</span>
                <span>{stats.avg_session_score}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
