
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download, X } from 'lucide-react';

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

  const getPageTitle = (page: string) => {
    const titles: Record<string, string> = {
      'overview': 'Dashboard',
      'customer-insights': 'Customer insights',
      'sentiment': 'Sentiment analysis',
      'performance': 'Performance',
      'feedback': 'Feedback',
      'questions': 'Questions',
      'members': 'Users and permissions',
      'integrations': 'Integrations',
      'settings': 'Settings'
    };
    return titles[page] || 'Dashboard';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1.5 transition-colors" />
          <h1 className="text-xl font-normal text-gray-900 dark:text-gray-100 font-sans">
            {getPageTitle(currentPage)}
          </h1>
        </div>

        <div className="flex items-center gap-3">
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
              className="h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 font-sans"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading || !analyticsData?.questions.length} 
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium font-sans"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
