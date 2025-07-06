
import React from 'react';
import { H1, Body } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap } from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { useDashboardData } from './DashboardDataProvider';

interface DashboardOverviewContentProps {
  onTabChange: (tab: string) => void;
}

export const DashboardOverviewContent: React.FC<DashboardOverviewContentProps> = ({ onTabChange }) => {
  const { organization } = useDashboardData();

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <H1 className="mb-2 flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span>Analytics Command Center</span>
          </H1>
          <Body className="text-gray-600">
            Comprehensive insights and performance metrics for <span className="font-semibold text-orange-600">{organization?.name}</span>
          </Body>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Real-time Data</span>
          </Badge>
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            Enhanced Dashboard
          </Badge>
        </div>
      </div>
      
      {/* Information-Rich Dashboard */}
      <DashboardOverview 
        organizationId={organization?.id || ''} 
        onTabChange={onTabChange} 
      />
    </div>
  );
};
