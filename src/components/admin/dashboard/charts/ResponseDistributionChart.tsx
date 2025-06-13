
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ResponseDistributionChartProps {
  data?: Array<{
    score: string;
    count: number;
    percentage: number;
  }>;
  isLoading?: boolean;
}

export const ResponseDistributionChart: React.FC<ResponseDistributionChartProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const mockData = [
    { score: '1 Star', count: 5, percentage: 8 },
    { score: '2 Stars', count: 8, percentage: 12 },
    { score: '3 Stars', count: 15, percentage: 23 },
    { score: '4 Stars', count: 25, percentage: 38 },
    { score: '5 Stars', count: 12, percentage: 19 }
  ];

  const chartData = data.length > 0 ? data : mockData;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Response Distribution
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
          <BarChart3 className="w-5 h-5 mr-2" />
          Response Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
