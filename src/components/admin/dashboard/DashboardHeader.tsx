
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Top row: Breadcrumbs and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors" />
              <DashboardBreadcrumb 
                organizationName={organizationName}
                currentPage={currentPage}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 rounded-lg hover:bg-gray-100/80"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-lg hover:bg-gray-100/80"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom row: Filters and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              Manage your organization and view analytics
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <DatePickerWithRange
                selected={dateRange}
                onSelect={setDateRange}
                className={cn(
                  "w-full sm:w-auto",
                  "border-gray-200 bg-white/80 backdrop-blur-sm",
                  "hover:bg-white/90 transition-colors"
                )}
                placeholder="Filter by date range"
              />
              <div className="flex gap-2">
                {dateRange && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDateRange(undefined)} 
                    className="h-9 px-3 text-sm border border-gray-200 bg-white/80 hover:bg-white/90"
                  >
                    Clear
                  </Button>
                )}
                <Button 
                  onClick={handleExport} 
                  disabled={isLoading || !analyticsData?.questions.length}
                  size="sm"
                  className={cn(
                    "h-9 px-4 text-sm font-medium",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "hover:from-orange-600 hover:to-orange-700",
                    "shadow-sm border-0"
                  )}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
