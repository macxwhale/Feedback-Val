
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface SummaryMetric {
  label: string;
  value: string | number;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

interface DataSummaryBarProps {
  metrics: SummaryMetric[];
  title?: string;
}

export const DataSummaryBar: React.FC<DataSummaryBarProps> = ({ 
  metrics, 
  title = "Performance Overview" 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-700 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-white shadow-sm border-0 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getStatusColor(metric.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(metric.status)}
                  {metric.trend && getTrendIcon(metric.trend)}
                </div>
              </div>
              
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </span>
              </div>
              
              {metric.target && typeof metric.value === 'number' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-1.5"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
