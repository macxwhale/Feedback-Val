import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DashboardSearch } from './DashboardSearch';
import { NotificationDropdown } from './NotificationDropdown';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download } from 'lucide-react';
import { DashboardUserMenu } from './DashboardUserMenu';

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

  const handleExport = () => {
    if (analyticsData) {
      const date = new Date().toISOString().split('T')[0];
      downloadCSV(analyticsData.questions, `questions-analytics-${date}.csv`);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mb-6">
      {/* Top row: Breadcrumbs, Search/Notifications, User menu */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <DashboardBreadcrumb 
            organizationName={organizationName}
            currentPage={currentPage}
          />
        </div>
        <div className="flex items-center space-x-2 justify-end">
          <DashboardSearch 
            organizationId={organizationId}
            onNavigate={onNavigate}
          />
          <NotificationDropdown organizationId={organizationId} />
          {/* User menu on far right */}
          <DashboardUserMenu />
        </div>
      </div>

      {/* Bottom row: Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
        <DatePickerWithRange
          selected={dateRange}
          onSelect={setDateRange}
          className="w-full sm:w-auto"
          placeholder="Filter by date range"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          {dateRange && (
            <Button variant="ghost" onClick={() => setDateRange(undefined)} className="w-full sm:w-auto">
              Clear
            </Button>
          )}
          <Button onClick={handleExport} disabled={isLoading || !analyticsData?.questions.length} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};
