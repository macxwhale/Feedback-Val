
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, RefreshCw, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryMetric {
  label: string;
  value: string | number;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  change?: {
    value: number;
    period: string;
  };
}

interface DataSummaryBarProps {
  metrics: SummaryMetric[];
  title?: string;
  lastUpdated?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DataSummaryBar: React.FC<DataSummaryBarProps> = ({ 
  metrics, 
  title = "System Overview",
  lastUpdated,
  onRefresh,
  isRefreshing = false
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
      case 'good': return 'text-green-800 bg-green-50 border-green-200 ring-green-100';
      case 'warning': return 'text-amber-800 bg-amber-50 border-amber-200 ring-amber-100';
      case 'critical': return 'text-red-800 bg-red-50 border-red-200 ring-red-100';
      default: return 'text-gray-800 bg-gray-50 border-gray-200 ring-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return null;
    }
  };

  const getOverallStatus = () => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    
    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'good';
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className="bg-gradient-to-r from-white via-orange-50/30 to-amber-50/20 border-0 shadow-sm ring-1 ring-black/5">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ring-1",
                getStatusColor(overallStatus)
              )}>
                {getStatusIcon(overallStatus)}
                <span className="capitalize">{overallStatus}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            </div>
            {lastUpdated && (
              <Badge variant="secondary" className="text-xs font-medium">
                Updated {lastUpdated}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="h-8 px-3"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                <span className="ml-1 text-xs">Refresh</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={cn(
                "relative p-4 rounded-xl border ring-1 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                getStatusColor(metric.status)
              )}
            >
              {/* Metric Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(metric.status)}
                  {metric.trend && getTrendIcon(metric.trend)}
                </div>
              </div>
              
              {/* Main Value */}
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </span>
                {metric.change && (
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    metric.change.value >= 0 
                      ? "text-green-700 bg-green-100" 
                      : "text-red-700 bg-red-100"
                  )}>
                    {metric.change.value > 0 ? '+' : ''}{metric.change.value}% {metric.change.period}
                  </span>
                )}
              </div>
              
              {/* Description */}
              {metric.description && (
                <p className="text-xs text-gray-600 mb-3">{metric.description}</p>
              )}
              
              {/* Progress Bar for Target Metrics */}
              {metric.target && typeof metric.value === 'number' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Target Progress</span>
                    <span className="font-bold text-gray-900">
                      {Math.round((metric.value / metric.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{metric.target.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200/60">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {metrics.filter(m => m.status === 'good').length} healthy, 
                {metrics.filter(m => m.status === 'warning').length} warning, 
                {metrics.filter(m => m.status === 'critical').length} critical
              </span>
            </div>
            <div className="text-gray-500">
              Real-time monitoring active
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
