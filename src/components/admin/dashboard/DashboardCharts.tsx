
import React from 'react';
import { H2, Body } from '@/components/ui/typography';
import { SessionTrendsChart } from './charts/SessionTrendsChart';
import { AnalyticsTable } from './AnalyticsTable';
import { AnalyticsInsights } from './AnalyticsInsights';
import { useDashboardData } from './DashboardDataProvider';

export const DashboardCharts: React.FC = () => {
  const { stats, analyticsData, isLoading } = useDashboardData();

  return (
    <>
      {/* Trend Analysis Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <H2 className="mb-4">Trend Analysis</H2>
        <Body className="text-gray-600 mb-4">Key metrics over the selected period</Body>
        <SessionTrendsChart isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Dashboard Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <H2>Analytics Dashboard</H2>
          </div>
          <AnalyticsTable 
            questions={analyticsData?.questions || []}
            categories={analyticsData?.categories || []}
            summary={analyticsData?.summary || {
              total_questions: stats?.total_questions ?? 0,
              total_responses: stats?.total_responses ?? 0,
              overall_avg_score: stats?.avg_session_score ?? 0,
              overall_completion_rate: stats?.completed_sessions && stats?.total_sessions 
                ? Math.round((stats.completed_sessions / stats.total_sessions) * 100)
                : 0
            }}
          />
        </div>
        
        {/* Analytics Insights */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <H2>Analytics Insights</H2>
          </div>
          <div className="p-6">
            <AnalyticsInsights 
              stats={stats ? {
                total_questions: stats.total_questions,
                total_responses: stats.total_responses,
                total_sessions: stats.total_sessions,
                completed_sessions: stats.completed_sessions,
                active_members: stats.active_members,
                avg_session_score: stats.avg_session_score,
                growth_metrics: stats.growth_metrics || {
                  sessions_this_month: 0,
                  sessions_last_month: 0,
                  growth_rate: null
                }
              } : undefined}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};
