
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { OrganizationSpecificStats } from './OrganizationSpecificStats';
import { OrganizationHeader } from './OrganizationHeader';
import { OrganizationSettingsTab } from './OrganizationSettingsTab';
import { QuestionsManagement } from './QuestionsManagement';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { RecentActivity } from './dashboard/RecentActivity';
import { QuickActions } from './dashboard/QuickActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthWrapper';

export const OrganizationAdminDashboard: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch organization data
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600">The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleQuickActions = {
    onCreateQuestion: () => setActiveTab('questions'),
    onInviteUser: () => setActiveTab('members'),
    onExportData: () => setActiveTab('feedback'),
    onViewSettings: () => setActiveTab('settings')
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizationHeader organization={organization} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview organizationId={organization.id} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity organizationId={organization.id} />
              <QuickActions {...handleQuickActions} />
            </div>
          </TabsContent>

          <TabsContent value="members">
            <UserManagement 
              organizationId={organization.id}
              organizationName={organization.name}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <OrganizationSpecificStats organizationId={organization.id} />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionsManagement />
          </TabsContent>

          <TabsContent value="settings">
            <OrganizationSettingsTab organization={organization} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
