
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react';

interface OperationalAnalyticsProps {
  organizationId: string;
  department?: string;
}

export const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({
  organizationId,
  department = 'all'
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const departmentMetrics = {
    'customer-service': {
      name: 'Customer Service',
      metrics: {
        responseTime: 2.1,
        resolutionRate: 87,
        satisfaction: 4.3,
        volume: 156
      },
      issues: [
        { title: 'Long wait times', count: 23, trend: 'up' },
        { title: 'Poor phone quality', count: 18, trend: 'stable' },
        { title: 'Lack of product knowledge', count: 15, trend: 'down' }
      ]
    },
    'sales': {
      name: 'Sales',
      metrics: {
        responseTime: 1.8,
        resolutionRate: 92,
        satisfaction: 4.1,
        volume: 89
      },
      issues: [
        { title: 'Pricing concerns', count: 12, trend: 'up' },
        { title: 'Product availability', count: 8, trend: 'stable' },
        { title: 'Delivery delays', count: 6, trend: 'down' }
      ]
    },
    'technical': {
      name: 'Technical Support',
      metrics: {
        responseTime: 3.2,
        resolutionRate: 78,
        satisfaction: 3.9,
        volume: 234
      },
      issues: [
        { title: 'Complex technical issues', count: 45, trend: 'up' },
        { title: 'Insufficient documentation', count: 32, trend: 'stable' },
        { title: 'Escalation delays', count: 28, trend: 'up' }
      ]
    }
  };

  const actionItems = [
    {
      id: 1,
      title: 'Implement callback system for customer service',
      priority: 'high',
      department: 'customer-service',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-20',
      status: 'in-progress',
      impact: 'Reduce wait time by 40%'
    },
    {
      id: 2,
      title: 'Update product training materials',
      priority: 'medium',
      department: 'sales',
      assignee: 'Mike Chen',
      dueDate: '2024-01-25',
      status: 'pending',
      impact: 'Improve product knowledge scores by 25%'
    },
    {
      id: 3,
      title: 'Create technical troubleshooting guides',
      priority: 'high',
      department: 'technical',
      assignee: 'Alex Rodriguez',
      dueDate: '2024-01-18',
      status: 'completed',
      impact: 'Reduce resolution time by 30%'
    }
  ];

  const departments = Object.keys(departmentMetrics);

  return (
    <div className="space-y-6">
      {/* Department Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Operational Analytics</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={activeFilter} 
              onChange={(e) => setActiveFilter(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {departmentMetrics[dept as keyof typeof departmentMetrics].name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments
          .filter(dept => activeFilter === 'all' || activeFilter === dept)
          .map(dept => {
            const data = departmentMetrics[dept as keyof typeof departmentMetrics];
            return (
              <Card key={dept}>
                <CardHeader>
                  <CardTitle className="text-lg">{data.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Avg Response Time</p>
                      <p className="text-lg font-bold">{data.metrics.responseTime}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Resolution Rate</p>
                      <p className="text-lg font-bold">{data.metrics.resolutionRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Satisfaction</p>
                      <p className="text-lg font-bold">{data.metrics.satisfaction}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Volume</p>
                      <p className="text-lg font-bold">{data.metrics.volume}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Top Issues</p>
                    <div className="space-y-2">
                      {data.issues.map((issue, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="truncate">{issue.title}</span>
                          <div className="flex items-center space-x-1">
                            <span>{issue.count}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              issue.trend === 'up' ? 'bg-red-500' :
                              issue.trend === 'down' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Action Items Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items & Follow-up</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Items</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {actionItems
                .filter(item => item.status !== 'completed')
                .map(item => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.impact}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Assignee: {item.assignee}</span>
                        <span>Due: {item.dueDate}</span>
                        <span>Dept: {departmentMetrics[item.department as keyof typeof departmentMetrics]?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        item.priority === 'high' ? 'destructive' :
                        item.priority === 'medium' ? 'outline' : 'secondary'
                      }>
                        {item.priority}
                      </Badge>
                      <Badge variant={
                        item.status === 'in-progress' ? 'default' :
                        item.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {actionItems
                .filter(item => item.status === 'completed')
                .map(item => (
                <div key={item.id} className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">{item.title}</h4>
                      <p className="text-sm text-green-700 mt-1">{item.impact}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-green-600">
                        <span>Completed by: {item.assignee}</span>
                        <span>Impact achieved</span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="overdue">
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No overdue items - great job!</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>Live Feedback Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm">Feedback submissions today</span>
                <Badge variant="default">24 new</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-sm">Average response time</span>
                <Badge variant="outline">2.3 min</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm">Satisfaction trend</span>
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Customer Satisfaction</span>
                <span>4.2/5.0 (84%)</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Rate</span>
                <span>87/90% (97%)</span>
              </div>
              <Progress value={97} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Issue Resolution</span>
                <span>78/85% (92%)</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
