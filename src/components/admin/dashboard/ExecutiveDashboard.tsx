
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

interface ExecutiveDashboardProps {
  organizationId: string;
  stats?: any;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  organizationId,
  stats
}) => {
  const kpis = [
    {
      title: 'Customer Satisfaction',
      value: stats?.avg_session_score || 4.2,
      target: 4.5,
      trend: '+5%',
      isPositive: true,
      icon: Target,
      suffix: '/5'
    },
    {
      title: 'Response Rate',
      value: Math.round(((stats?.completed_sessions || 85) / Math.max(stats?.total_sessions || 100, 1)) * 100),
      target: 90,
      trend: '+12%',
      isPositive: true,
      icon: Users,
      suffix: '%'
    },
    {
      title: 'Issue Resolution Time',
      value: 2.3,
      target: 2.0,
      trend: '-8%',
      isPositive: true,
      icon: Clock,
      suffix: ' days'
    },
    {
      title: 'Cost per Feedback',
      value: 0.85,
      target: 1.0,
      trend: '-15%',
      isPositive: true,
      icon: DollarSign,
      prefix: '$'
    }
  ];

  const alerts = [
    {
      type: 'critical',
      title: 'Service Quality Alert',
      message: 'Staff service ratings dropped 15% this week',
      priority: 'high'
    },
    {
      type: 'warning',
      title: 'Response Time Increasing',
      message: 'Average feedback completion time up 25%',
      priority: 'medium'
    },
    {
      type: 'success',
      title: 'Customer Retention Improving',
      message: 'Positive feedback increased 20% month-over-month',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">
                      {kpi.prefix}{kpi.value}{kpi.suffix}
                    </span>
                    <Badge variant={kpi.isPositive ? 'default' : 'destructive'} className="text-xs">
                      {kpi.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {kpi.trend}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Target: {kpi.prefix}{kpi.target}{kpi.suffix}</span>
                      <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                    </div>
                    <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                  </div>
                </div>
                <kpi.icon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Critical Insights & Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-green-500 bg-green-50'
              }`}>
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  </div>
                  <Badge variant={
                    alert.priority === 'high' ? 'destructive' :
                    alert.priority === 'medium' ? 'outline' : 'secondary'
                  }>
                    {alert.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">4.2/5</span>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.3
                  </Badge>
                </div>
              </div>
              <Progress value={84} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">4.1/5</span>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.2
                  </Badge>
                </div>
              </div>
              <Progress value={82} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Quarter</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">3.9/5</span>
                  <Badge variant="outline" className="text-xs">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -0.1
                  </Badge>
                </div>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Priority Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-900">Improve Staff Training</span>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-xs text-red-700 mt-1">ROI: 300% | Timeline: 2 weeks</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-yellow-900">Optimize Wait Times</span>
                  <Badge variant="outline">High</Badge>
                </div>
                <p className="text-xs text-yellow-700 mt-1">ROI: 250% | Timeline: 1 week</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Launch Referral Program</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <p className="text-xs text-blue-700 mt-1">ROI: 180% | Timeline: 3 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
