
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, X, Bell, Settings } from 'lucide-react';

interface GoogleInspiredHeaderProps {
  organizationName: string;
  organizationId: string;
  currentPage: string;
  onNavigate: (url: string) => void;
}

export const GoogleInspiredHeader: React.FC<GoogleInspiredHeaderProps> = ({
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
    <div className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section - Google Play Console style branding */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="hover:bg-gray-100 rounded p-2 transition-colors" />
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <span className="text-gray-700 font-medium">Play Console</span>
            </div>
            <div className="text-gray-400">|</div>
            <span className="text-gray-900 font-medium">{organizationName}</span>
          </div>
        </div>

        {/* Right section - Actions and user menu */}
        <div className="flex items-center gap-4">
          <DatePickerWithRange
            selected={dateRange}
            onSelect={setDateRange}
            className="w-auto"
            placeholder="Select date range"
          />
          
          {dateRange && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDateRange(undefined)} 
              className="h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !analyticsData?.questions.length} 
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>

          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </div>
  );
};
