
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  const [liveData, setLiveData] = useState({
    activeUsers: 12,
    feedbackSubmissions: 3,
    averageScore: 4.2,
    responseTime: 1.8,
    alerts: []
  });

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        feedbackSubmissions: prev.feedbackSubmissions + (Math.random() > 0.7 ? 1 : 0),
        averageScore: Math.round((prev.averageScore + (Math.random() - 0.5) * 0.1) * 10) / 10,
        responseTime: Math.round((prev.responseTime + (Math.random() - 0.5) * 0.2) * 10) / 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const recentActivity = [
    {
      id: 1,
      type: 'feedback_submitted',
      message: 'New 5-star feedback from customer',
      timestamp: '2 minutes ago',
      severity: 'success'
    },
    {
      id: 2,
      type: 'alert_triggered',
      message: 'Low satisfaction score detected (2/5)',
      timestamp: '5 minutes ago',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'feedback_submitted',
      message: 'Feedback session completed',
      timestamp: '7 minutes ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'improvement_suggestion',
      message: 'AI suggested: Reduce wait times',
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
                <p className="text-xs text-gray-500">Currently online</p>
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
            <CardTitle>Live Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">Critical Alert</span>
                  <Badge variant="destructive">New</Badge>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Multiple low satisfaction scores detected in customer service department
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Performance Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Response time increased by 25% in the last hour
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Positive Trend</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Customer satisfaction improved 15% since this morning
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-100 border border-green-300">
              <h4 className="font-medium text-green-900">Sales</h4>
              <p className="text-2xl font-bold text-green-700">4.6/5</p>
              <p className="text-sm text-green-600">Excellent performance</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-300">
              <h4 className="font-medium text-yellow-900">Customer Service</h4>
              <p className="text-2xl font-bold text-yellow-700">3.8/5</p>
              <p className="text-sm text-yellow-600">Needs attention</p>
            </div>
            <div className="p-4 rounded-lg bg-red-100 border border-red-300">
              <h4 className="font-medium text-red-900">Technical Support</h4>
              <p className="text-2xl font-bold text-red-700">3.2/5</p>
              <p className="text-sm text-red-600">Critical issues</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
