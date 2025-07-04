
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Key, 
  Webhook,
  Database,
  MessageSquare,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';

export const SystemIntegrationsPanel: React.FC = () => {
  const integrations = [
    {
      id: 'api',
      name: 'REST API',
      description: 'Core API endpoints for feedback collection',
      status: 'active',
      icon: Code,
      metrics: { requests: '1.2M', uptime: '99.9%' }
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Real-time event notifications',
      status: 'active',
      icon: Webhook,
      metrics: { endpoints: '24', success: '98.5%' }
    },
    {
      id: 'sms',
      name: 'SMS Service',
      description: 'SMS feedback collection via Africa\'s Talking',
      status: 'warning',
      icon: MessageSquare,
      metrics: { sent: '15.3K', delivered: '94.2%' }
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Supabase PostgreSQL instance',
      status: 'active',
      icon: Database,
      metrics: { size: '2.4GB', connections: '45/100' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            API & Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system integrations and API configurations
          </p>
        </div>
        <ModernButton>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </ModernButton>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModernCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">4</div>
          <div className="text-sm text-gray-500">Active Services</div>
        </ModernCard>
        <ModernCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">99.2%</div>
          <div className="text-sm text-gray-500">Avg Uptime</div>
        </ModernCard>
        <ModernCard className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">1.2M</div>
          <div className="text-sm text-gray-500">API Requests</div>
        </ModernCard>
        <ModernCard className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">24</div>
          <div className="text-sm text-gray-500">Webhooks</div>
        </ModernCard>
      </div>

      {/* Integrations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <ModernCard key={integration.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <integration.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {integration.description}
                  </p>
                </div>
              </div>
              
              <StatusIndicator 
                status={integration.status === 'active' ? 'success' : 'warning'}
                label={integration.status === 'active' ? 'Active' : 'Warning'}
                size="sm"
                variant="dot"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(integration.metrics).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {key}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <ModernButton variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </ModernButton>
              <ModernButton variant="ghost" size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Logs
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* API Keys Section */}
      <ModernCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Key className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              API Key Management
            </h3>
          </div>
          <ModernButton size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Key
          </ModernButton>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                System Admin Key
              </div>
              <div className="text-sm text-gray-500">
                sk_live_••••••••••••••••
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Active</Badge>
              <ModernButton variant="ghost" size="sm">
                Manage
              </ModernButton>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};
