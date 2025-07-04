
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface UserEngagementChartProps {
  data?: Array<{
    category: string;
    activeUsers: number;
    newUsers: number;
  }>;
  isLoading?: boolean;
}

export const UserEngagementChart: React.FC<UserEngagementChartProps> = ({
  data = [],
  isLoading = false
}) => {
  const mockData = [
    { category: 'Week 1', activeUsers: 24, newUsers: 8 },
    { category: 'Week 2', activeUsers: 28, newUsers: 6 },
    { category: 'Week 3', activeUsers: 32, newUsers: 12 },
    { category: 'Week 4', activeUsers: 35, newUsers: 9 },
  ];

  const chartData = data.length > 0 ? data : mockData;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
            <Bar dataKey="newUsers" fill="#10b981" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
