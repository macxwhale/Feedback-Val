
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const AdminStats: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [orgsResult, responsesResult, sessionsResult] = await Promise.all([
        supabase.from('organizations').select('id, plan_type, is_active'),
        supabase.from('feedback_responses').select('id, created_at'),
        supabase.from('feedback_sessions').select('id, status, created_at')
      ]);

      return {
        organizations: orgsResult.data || [],
        responses: responsesResult.data || [],
        sessions: sessionsResult.data || []
      };
    }
  });

  const organizationStats = stats?.organizations.reduce((acc: any, org: any) => {
    acc.total++;
    if (org.is_active) acc.active++;
    acc.plans[org.plan_type || 'free'] = (acc.plans[org.plan_type || 'free'] || 0) + 1;
    return acc;
  }, { total: 0, active: 0, plans: {} }) || { total: 0, active: 0, plans: {} };

  const monthlyData = stats?.responses.reduce((acc: any[], response: any) => {
    const month = new Date(response.created_at).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.responses++;
    } else {
      acc.push({ month, responses: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationStats.total}</div>
            <p className="text-sm text-gray-600">{organizationStats.active} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.responses.length || 0}</div>
            <p className="text-sm text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.sessions.filter((s: any) => s.status === 'active').length || 0}
            </div>
            <p className="text-sm text-gray-600">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Response Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#007ACE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
