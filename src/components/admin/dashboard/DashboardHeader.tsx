
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './NotificationDropdown';
import { DashboardUserMenu } from './DashboardUserMenu';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, Bell, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useOrganization } from '@/context/OrganizationContext';

interface DashboardHeaderProps {
  organizationName: string;
  organizationId: string;
  currentPage: string;
  onNavigate: (url: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  organizationName,
  organizationId,
  currentPage,
  onNavigate
}) => {
  const { dateRange, setDateRange } = useDashboard();
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);
  const { user } = useAuth();
  const { organization } = useOrganization();

  const handleExport = () => {
    if (analyticsData) {
      const date = new Date().toISOString().split('T')[0];
      downloadCSV(analyticsData.questions, `questions-analytics-${date}.csv`);
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Left section with sidebar trigger and breadcrumb */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <DashboardBreadcrumb 
          organizationName={organizationName}
          currentPage={currentPage}
        />
      </div>

      {/* Center section with organization name */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {organization?.name || organizationName}
        </h2>
      </div>

      {/* Right section with controls and user menu */}
      <div className="flex items-center space-x-3">
        {/* Date filter and export controls */}
        <div className="hidden md:flex items-center space-x-2">
          <DatePickerWithRange
            selected={dateRange}
            onSelect={setDateRange}
            className="w-auto"
            placeholder="Filter by date range"
          />
          {dateRange && (
            <Button variant="ghost" size="sm" onClick={() => setDateRange(undefined)}>
              Clear
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={handleExport} 
            disabled={isLoading || !analyticsData?.questions.length}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Notifications */}
        <NotificationDropdown organizationId={organizationId} />

        {/* User menu */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
