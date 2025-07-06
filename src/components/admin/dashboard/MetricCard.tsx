
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, MoreVertical, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  secondaryMetrics?: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  icon: React.ComponentType<{ className?: string }>;
  status?: 'normal' | 'warning' | 'critical' | 'success';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  change,
  secondaryMetrics = [],
  icon: Icon,
  status = 'normal',
  actionLabel,
  onAction,
  className
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'border-l-amber-500 bg-amber-50/30';
      case 'critical': return 'border-l-red-500 bg-red-50/30';
      case 'success': return 'border-l-green-500 bg-green-50/30';
      default: return 'border-l-blue-500 bg-blue-50/20';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-200 border-l-4",
      getStatusColor(status),
      className
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {previousValue && (
                <span className="text-xs text-gray-500">
                  (was {typeof previousValue === 'number' ? previousValue.toLocaleString() : previousValue})
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Primary Change Indicator */}
        {change && (
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className={cn("text-xs px-2 py-1", getTrendColor(change.trend))}>
              {getTrendIcon(change.trend)}
              <span className="ml-1">
                {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                {Math.abs(change.value)}%
              </span>
            </Badge>
            <span className="text-xs text-gray-500">vs {change.period}</span>
          </div>
        )}

        {/* Secondary Metrics */}
        {secondaryMetrics.length > 0 && (
          <div className="space-y-2 mb-3">
            {secondaryMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </span>
                  {metric.trend && getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="w-full mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionLabel}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
