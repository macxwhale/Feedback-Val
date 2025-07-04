
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, X } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex flex-col space-y-4">
        {/* Top row: Sidebar trigger and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors" />
          <DashboardBreadcrumb 
            organizationName={organizationName}
            currentPage={currentPage}
          />
        </div>

        {/* Bottom row: Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <DatePickerWithRange
              selected={dateRange}
              onSelect={setDateRange}
              className="w-full sm:w-auto"
              placeholder="Filter by date range"
            />
            
            {dateRange && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDateRange(undefined)} 
                className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !analyticsData?.questions.length} 
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};
