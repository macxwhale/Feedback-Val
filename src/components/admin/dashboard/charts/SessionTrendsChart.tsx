
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SessionTrendsChartProps {
  data?: Array<{
    date: string;
    sessions: number;
    completedSessions: number;
  }>;
  isLoading?: boolean;
}

export const SessionTrendsChart: React.FC<SessionTrendsChartProps> = ({
  data = [],
  isLoading = false
}) => {
  const mockData = [
    { date: '2024-01', sessions: 45, completedSessions: 38 },
    { date: '2024-02', sessions: 52, completedSessions: 44 },
    { date: '2024-03', sessions: 48, completedSessions: 41 },
    { date: '2024-04', sessions: 61, completedSessions: 55 },
    { date: '2024-05', sessions: 67, completedSessions: 58 },
    { date: '2024-06', sessions: 72, completedSessions: 65 },
  ];

  const chartData = data.length > 0 ? data : mockData;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Session Trends
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
          <TrendingUp className="w-5 h-5 mr-2" />
          Session Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Total Sessions"
            />
            <Line 
              type="monotone" 
              dataKey="completedSessions" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Completed Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
