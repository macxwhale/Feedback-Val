
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { 
  Building2, 
  Users, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import type { Organization } from '@/services/organizationService.types';

interface SystemOrganizationsListProps {
  organizations: Organization[];
}

export const SystemOrganizationsList: React.FC<SystemOrganizationsListProps> = ({
  organizations
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const filteredOrgs = organizations.filter(org => {
    if (filter === 'active') return org.is_active;
    if (filter === 'inactive') return !org.is_active;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Organizations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all organizations across the platform
          </p>
        </div>
        <ModernButton>
          <Building2 className="h-4 w-4 mr-2" />
          Add Organization
        </ModernButton>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <ModernButton
          variant={filter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({organizations.length})
        </ModernButton>
        <ModernButton
          variant={filter === 'active' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({organizations.filter(org => org.is_active).length})
        </ModernButton>
        <ModernButton
          variant={filter === 'inactive' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('inactive')}
        >
          Inactive ({organizations.filter(org => !org.is_active).length})
        </ModernButton>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => (
          <ModernCard key={org.id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-play rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">
                    {org.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {org.name}
                  </h3>
                  <p className="text-sm text-gray-500">/{org.slug}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <StatusIndicator 
                  status={org.is_active ? "success" : "neutral"} 
                  label={org.is_active ? "Active" : "Inactive"}
                  size="sm"
                  variant="dot"
                />
                <ModernButton variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </ModernButton>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Plan</span>
                <Badge variant="secondary">{org.plan_type}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Members</span>
                <span className="font-medium">{org.active_members || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">
                  {new Date(org.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ModernButton variant="ghost" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </ModernButton>
              <ModernButton variant="ghost" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </ModernButton>
            </div>
          </ModernCard>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            No organizations found
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "Get started by creating your first organization."
              : `No ${filter} organizations found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};
