
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

interface RealTimeAnalyticsProps {
  organizationId: string;
}

export const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({
  organizationId
}) => {
  const [isLive, setIsLive] = useState(true);
  const { liveData, isLoading } = useRealTimeAnalytics(organizationId);

  const recentActivity = [
    {
      id: 1,
      type: 'feedback_submitted',
      message: `${liveData.feedbackSubmissions} new feedback submissions in last 10 minutes`,
      timestamp: '2 minutes ago',
      severity: 'success'
    },
    {
      id: 2,
      type: 'alert_triggered',
      message: liveData.averageScore < 3 ? 'Low satisfaction scores detected' : 'Satisfaction levels stable',
      timestamp: '5 minutes ago',
      severity: liveData.averageScore < 3 ? 'warning' : 'info'
    },
    {
      id: 3,
      type: 'feedback_submitted',
      message: `${liveData.activeUsers} active users currently providing feedback`,
      timestamp: '7 minutes ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'improvement_suggestion',
      message: liveData.responseTime > 3 ? 'Consider optimizing response time' : 'Response times are optimal',
      timestamp: '12 minutes ago',
      severity: 'info'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feedback_submitted': return <MessageSquare className="w-4 h-4" />;
      case 'alert_triggered': return <AlertTriangle className="w-4 h-4" />;
      case 'improvement_suggestion': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="live-mode">Live Updates</Label>
          <Switch
            id="live-mode"
            checked={isLive}
            onCheckedChange={setIsLive}
          />
          {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{liveData.activeUsers}</p>
                <p className="text-xs text-gray-500">Last 10 minutes</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{liveData.feedbackSubmissions}</p>
                <p className="text-xs text-gray-500">Last 10 minutes</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">{liveData.averageScore}/5</p>
                <p className="text-xs text-gray-500">Real-time average</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{liveData.responseTime}min</p>
                <p className="text-xs text-gray-500">Average completion</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Live Activity Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map(activity => (
                <div 
                  key={activity.id}
                  className={`p-3 rounded-lg border ${getActivityColor(activity.severity)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs opacity-75">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                liveData.averageScore < 3 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {liveData.averageScore < 3 ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className={`font-medium ${
                    liveData.averageScore < 3 ? 'text-red-900' : 'text-green-900'
                  }`}>
                    {liveData.averageScore < 3 ? 'Satisfaction Alert' : 'Satisfaction Good'}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  liveData.averageScore < 3 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {liveData.averageScore < 3 
                    ? `Current average score: ${liveData.averageScore}/5 - needs attention`
                    : `Current average score: ${liveData.averageScore}/5 - performing well`
                  }
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                liveData.responseTime > 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${
                    liveData.responseTime > 3 ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <span className={`font-medium ${
                    liveData.responseTime > 3 ? 'text-yellow-900' : 'text-green-900'
                  }`}>
                    Response Time Status
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  liveData.responseTime > 3 ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  Average completion time: {liveData.responseTime} minutes
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">System Activity</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {liveData.activeUsers} users active, {liveData.feedbackSubmissions} submissions in last 10 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
