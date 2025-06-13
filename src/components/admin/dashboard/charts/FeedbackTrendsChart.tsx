
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface FeedbackTrendsChartProps {
  data?: Array<{
    date: string;
    responses: number;
    sessions: number;
    avgScore: number;
  }>;
  isLoading?: boolean;
}

export const FeedbackTrendsChart: React.FC<FeedbackTrendsChartProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const mockData = [
    { date: '2024-01', responses: 45, sessions: 12, avgScore: 4.2 },
    { date: '2024-02', responses: 52, sessions: 15, avgScore: 4.1 },
    { date: '2024-03', responses: 38, sessions: 10, avgScore: 4.5 },
    { date: '2024-04', responses: 61, sessions: 18, avgScore: 4.3 },
    { date: '2024-05', responses: 49, sessions: 14, avgScore: 4.4 },
    { date: '2024-06', responses: 67, sessions: 20, avgScore: 4.6 }
  ];

  const chartData = data.length > 0 ? data : mockData;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Feedback Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Feedback Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="responses" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Responses"
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
