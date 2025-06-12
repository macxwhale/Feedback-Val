
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllOrganizations } from '@/services/organizationService';
import { AdminStats } from './AdminStats';
import { FormConfig } from './FormConfig';
import { WebhookSettings } from './WebhookSettings';
import { DataExport } from './DataExport';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('organizations');
  
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganizations,
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>
      
      <div className="grid gap-4">
        {organizations?.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {org.logo_url && (
                    <img src={org.logo_url} alt={org.name} className="w-12 h-12 rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{org.name}</h3>
                    <p className="text-sm text-gray-600">/{org.slug}</p>
                    {org.domain && (
                      <p className="text-sm text-blue-600">{org.domain}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getPlanBadgeColor(org.plan_type || 'free')}>
                    {org.plan_type || 'Free'}
                  </Badge>
                  <Badge variant={org.is_active ? 'default' : 'secondary'}>
                    {org.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage organizations and system settings</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'organizations', label: 'Organizations', icon: Users },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
            { id: 'config', label: 'Configuration', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'organizations' && renderOrganizations()}
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <FormConfig />
            <WebhookSettings />
            <DataExport />
          </div>
        )}
      </div>
    </div>
  );
};
