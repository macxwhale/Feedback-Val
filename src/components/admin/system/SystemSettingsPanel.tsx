
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernInput } from '@/components/ui/modern-input';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield,
  Save,
  RefreshCw
} from 'lucide-react';

export const SystemSettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure global system settings and preferences
          </p>
        </div>
        <ModernButton>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </ModernButton>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Settings */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Database Configuration
            </h3>
          </div>
          
          <div className="space-y-4">
            <StatusIndicator 
              status="success" 
              label="Database Connected" 
              variant="badge"
            />
            
            <div className="space-y-3">
              <ModernInput
                label="Connection Pool Size"
                value="20"
                type="number"
              />
              <ModernInput
                label="Query Timeout (ms)"
                value="30000"
                type="number"
              />
              <ModernInput
                label="Backup Frequency"
                value="Daily"
                disabled
              />
            </div>
          </div>
        </ModernCard>

        {/* Email Settings */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Email Configuration
            </h3>
          </div>
          
          <div className="space-y-4">
            <StatusIndicator 
              status="success" 
              label="SMTP Connected" 
              variant="badge"
            />
            
            <div className="space-y-3">
              <ModernInput
                label="SMTP Host"
                value="smtp.example.com"
                type="email"
              />
              <ModernInput
                label="SMTP Port"
                value="587"
                type="number"
              />
              <ModernInput
                label="From Email"
                value="noreply@pulsify.com"
                type="email"
              />
            </div>
          </div>
        </ModernCard>

        {/* Security Settings */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Security Configuration
            </h3>
          </div>
          
          <div className="space-y-4">
            <StatusIndicator 
              status="success" 
              label="Security Enabled" 
              variant="badge"
            />
            
            <div className="space-y-3">
              <ModernInput
                label="Session Timeout (minutes)"
                value="60"
                type="number"
              />
              <ModernInput
                label="Max Login Attempts"
                value="5"
                type="number"
              />
              <ModernInput
                label="Password Min Length"
                value="8"
                type="number"
              />
            </div>
          </div>
        </ModernCard>

        {/* Performance Settings */}
        <ModernCard className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Performance Settings
            </h3>
          </div>
          
          <div className="space-y-4">
            <StatusIndicator 
              status="success" 
              label="Optimized" 
              variant="badge"
            />
            
            <div className="space-y-3">
              <ModernInput
                label="Cache TTL (seconds)"
                value="3600"
                type="number"
              />
              <ModernInput
                label="Rate Limit (req/min)"
                value="1000"
                type="number"
              />
              <ModernButton variant="outline" size="sm" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Cache
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
};
