
import React from 'react';
import { MetricCard, ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { 
  Building2, 
  Users, 
  Activity, 
  Shield,
  ArrowRight,
  Plus,
  Download,
  AlertTriangle
} from 'lucide-react';
import type { Organization } from '@/services/organizationService.types';

interface SystemOverviewDashboardProps {
  organizations: Organization[];
}

export const SystemOverviewDashboard: React.FC<SystemOverviewDashboardProps> = ({
  organizations
}) => {
  const activeOrgs = organizations.filter(org => org.is_active).length;
  const totalUsers = organizations.length * 8; // Approximate calculation
  const recentOrgs = organizations.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            System Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your entire Pulsify platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ModernButton variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </ModernButton>
          <ModernButton size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </ModernButton>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Organizations"
          value={activeOrgs}
          icon={Building2}
          trend={{
            value: 8,
            label: "vs last month",
            isPositive: true
          }}
          color="blue"
        />
        
        <MetricCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend={{
            value: 15,
            label: "vs last month",
            isPositive: true
          }}
          color="green"
        />
        
        <MetricCard
          title="System Health"
          value="99.9%"
          icon={Activity}
          color="purple"
        />
        
        <MetricCard
          title="Security Score"
          value="A+"
          icon={Shield}
          color="orange"
        />
      </div>

      {/* System Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModernCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              System Status
            </h3>
            <ModernButton variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </ModernButton>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  Database
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  API Services
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                  SMS Service
                </span>
              </div>
              <span className="text-sm text-orange-600 dark:text-orange-400">Degraded</span>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Organizations
            </h3>
            <ModernButton variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </ModernButton>
          </div>
          
          <div className="space-y-3">
            {recentOrgs.map((org, index) => (
              <div key={org.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-play rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {org.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {org.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      - members
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {org.plan_type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>
    </div>
  );
};
