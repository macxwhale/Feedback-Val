
import React from 'react';
import { MetricCard, ModernCard, ActionCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  TrendingUp,
  Activity,
  Star,
  ArrowRight,
  Plus,
  Download,
  Settings as SettingsIcon
} from 'lucide-react';

interface ModernDashboardOverviewProps {
  stats?: {
    active_members: number;
    total_responses: number;
    total_sessions: number;
    avg_session_score: number;
    growth_metrics?: {
      growth_rate: number;
    };
  };
  onNavigate?: (section: string) => void;
}

export const ModernDashboardOverview: React.FC<ModernDashboardOverviewProps> = ({
  stats,
  onNavigate
}) => {
  const handleNavigate = (section: string) => {
    onNavigate?.(section);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your organization's feedback and engagement metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ModernButton variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </ModernButton>
          <ModernButton size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Question
          </ModernButton>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Members"
          value={stats?.active_members ?? 0}
          icon={Users}
          trend={{
            value: 12,
            label: "vs last month",
            isPositive: true
          }}
          color="blue"
        />
        
        <MetricCard
          title="Total Responses"
          value={stats?.total_responses ?? 0}
          icon={MessageSquare}
          trend={{
            value: 8,
            label: "vs last week",
            isPositive: true
          }}
          color="green"
        />
        
        <MetricCard
          title="Active Sessions"
          value={stats?.total_sessions ?? 0}
          icon={Activity}
          color="purple"
        />
        
        <MetricCard
          title="Avg Rating"
          value={stats?.avg_session_score ?? 0}
          icon={Star}
          color="orange"
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            title="Manage Team Members"
            description="Add, remove, or update member roles and permissions"
            icon={Users}
            action={{
              label: "Manage Members",
              onClick: () => handleNavigate('members')
            }}
          />
          
          <ActionCard
            title="View Feedback Analytics"
            description="Analyze response trends and customer sentiment"
            icon={BarChart3}
            action={{
              label: "View Analytics",
              onClick: () => handleNavigate('analytics')
            }}
          />
          
          <ActionCard
            title="Organization Settings"
            description="Configure organization preferences and integrations"
            icon={SettingsIcon}
            action={{
              label: "Open Settings",
              onClick: () => handleNavigate('settings')
            }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModernCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h3>
            <ModernButton variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </ModernButton>
          </div>
          
          <div className="space-y-4">
            {[
              { action: "New member joined", time: "2 minutes ago", type: "member" },
              { action: "Feedback response received", time: "15 minutes ago", type: "feedback" },
              { action: "Question updated", time: "1 hour ago", type: "question" },
              { action: "Analytics report generated", time: "3 hours ago", type: "report" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>

        <ModernCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Performance Insights
            </h3>
            <ModernButton variant="ghost" size="sm">
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </ModernButton>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Response Rate
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Above average performance
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-800 dark:text-green-300">
                  94%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +5% vs last month
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Engagement Score
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Strong user engagement
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-800 dark:text-blue-300">
                  8.7/10
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Excellent
                </p>
              </div>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};
