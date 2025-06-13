
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Download, Calendar, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportFeedbackData, ExportOptions } from '@/services/exportService';
import { DateRange } from 'react-day-picker';

interface DataExportDialogProps {
  organizationId: string;
  trigger?: React.ReactNode;
}

export const DataExportDialog: React.FC<DataExportDialogProps> = ({
  organizationId,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'excel' | 'json' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [includeAnalytics, setIncludeAnalytics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Mock data for now - in real implementation, fetch from API
      const mockData = [
        { id: 1, timestamp: new Date().toISOString(), score: 4, feedback: 'Great service' },
        { id: 2, timestamp: new Date().toISOString(), score: 5, feedback: 'Excellent' }
      ];

      const options: ExportOptions = {
        format,
        dateRange: dateRange ? {
          from: dateRange.from,
          to: dateRange.to
        } : undefined,
        includeAnalytics
      };

      await exportFeedbackData(mockData, options);
      
      toast({
        title: 'Export Successful',
        description: `Data exported in ${format.toUpperCase()} format`
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Feedback Data</DialogTitle>
          <DialogDescription>
            Choose your export format and date range to download feedback data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Report
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range (Optional)
            </Label>
            <DatePickerWithRange
              selected={dateRange}
              onSelect={setDateRange}
              placeholder="Select date range"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="analytics"
              checked={includeAnalytics}
              onCheckedChange={(checked) => setIncludeAnalytics(checked as boolean)}
            />
            <Label htmlFor="analytics">Include analytics data</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
