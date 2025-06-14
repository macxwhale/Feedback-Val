
import React from 'react';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useAnalyticsTableData } from '@/hooks/useAnalyticsTableData';
import { downloadCSV } from '@/lib/csv';
import { Download } from 'lucide-react';

interface DashboardFiltersProps {
  organizationId: string;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ organizationId }) => {
  const { dateRange, setDateRange } = useDashboard();
  const { data: analyticsData, isLoading } = useAnalyticsTableData(organizationId);

  const handleExport = () => {
    if (analyticsData) {
      const date = new Date().toISOString().split('T')[0];
      downloadCSV(analyticsData.questions, `questions-analytics-${date}.csv`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
      <DatePickerWithRange
        selected={dateRange}
        onSelect={setDateRange}
        className="w-full sm:w-auto sm:max-w-sm"
        placeholder="Filter by date range"
      />
      <div className="flex gap-2">
        {dateRange && (
          <Button variant="ghost" onClick={() => setDateRange(undefined)}>
            Clear
          </Button>
        )}
        <Button onClick={handleExport} disabled={isLoading || !analyticsData?.questions.length}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
