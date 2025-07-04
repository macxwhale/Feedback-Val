
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, Bell, Settings } from 'lucide-react';

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
    <div className="px-6 py-4">
      <div className="flex flex-col space-y-4">
        {/* Top row: Sidebar trigger and Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="h-8 w-8 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors" />
            <DashboardBreadcrumb 
              organizationName={organizationName}
              currentPage={currentPage}
            />
          </div>
          
          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-50">
              <Bell className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-50">
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <DatePickerWithRange
              selected={dateRange}
              onSelect={setDateRange}
              className="w-full sm:w-auto h-9 text-sm border-gray-200 hover:border-gray-300 focus:border-blue-500"
              placeholder="Select date range"
            />
            {dateRange && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDateRange(undefined)}
                className="h-9 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !analyticsData?.questions.length}
            size="sm"
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export data
          </Button>
        </div>
      </div>
    </div>
  );
};
