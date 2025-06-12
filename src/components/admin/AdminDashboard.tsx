
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, Users, BarChart3, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrganizations, updateOrganization, createOrganization, CreateOrganizationData } from '@/services/organizationService';
import { AdminStats } from './AdminStats';
import { FormConfig } from './FormConfig';
import { WebhookSettings } from './WebhookSettings';
import { DataExport } from './DataExport';
import { CreateOrganizationModal } from './CreateOrganizationModal';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('organizations');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganizations,
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      updateOrganization(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization updated successfully');
    },
    onError: () => {
      toast.error('Failed to update organization');
    }
  });

  const createOrgMutation = useMutation({
    mutationFn: (orgData: CreateOrganizationData) => createOrganization(orgData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setShowCreateModal(false);
      toast.success('Organization created successfully');
    },
    onError: () => {
      toast.error('Failed to create organization');
    }
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleActive = (orgId: string, currentStatus: boolean) => {
    updateOrgMutation.mutate({
      id: orgId,
      updates: { is_active: !currentStatus }
    });
  };

  const handleUpdatePlan = (orgId: string, planType: string) => {
    updateOrgMutation.mutate({
      id: orgId,
      updates: { plan_type: planType }
    });
  };

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Organizations</h2>
          <p className="text-gray-600">Manage all organizations in the system</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{organizations?.length || 0}</div>
            <p className="text-sm text-gray-600">Total Organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {organizations?.filter(org => org.is_active).length || 0}
            </div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {organizations?.filter(org => org.plan_type === 'pro').length || 0}
            </div>
            <p className="text-sm text-gray-600">Pro Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {organizations?.filter(org => org.plan_type === 'enterprise').length || 0}
            </div>
            <p className="text-sm text-gray-600">Enterprise</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4">
        {organizations?.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {org.logo_url && (
                    <img src={org.logo_url} alt={org.name} className="w-12 h-12 rounded-lg object-cover" />
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
                    {(org.plan_type || 'free').toUpperCase()}
                  </Badge>
                  <Badge variant={org.is_active ? 'default' : 'secondary'}>
                    {org.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500">Max Responses</Label>
                  <p className="font-medium">{org.max_responses || 100}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Created</Label>
                  <p className="font-medium">{new Date(org.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Trial Ends</Label>
                  <p className="font-medium">
                    {org.trial_ends_at ? new Date(org.trial_ends_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Billing Email</Label>
                  <p className="font-medium">{org.billing_email || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={org.is_active}
                      onCheckedChange={() => handleToggleActive(org.id, org.is_active)}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                  
                  <select 
                    value={org.plan_type || 'free'}
                    onChange={(e) => handleUpdatePlan(org.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/${org.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createOrgMutation.mutate(data)}
        />
      )}
    </div>
  );

  if (isLoading) {
    return <div className="p-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Admin Dashboard</h1>
          <p className="text-gray-600">Manage organizations, view statistics, and configure system settings</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'organizations', label: 'Organizations', icon: Users },
            { id: 'stats', label: 'System Statistics', icon: BarChart3 },
            { id: 'config', label: 'System Configuration', icon: Settings },
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
