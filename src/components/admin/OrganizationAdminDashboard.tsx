
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  UserPlus,
  TrendingUp,
  Calendar,
  Building
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { OrganizationStats } from './OrganizationStats';
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

  // Fetch organization statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['organization-stats', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;

      // Get member count
      const { data: membersData } = await supabase
        .from('organization_users')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('status', 'active');

      // Get feedback sessions count
      const { data: sessionsData } = await supabase
        .from('feedback_sessions')
        .select('id')
        .eq('organization_id', organization.id);

      // Get recent feedback sessions
      const { data: recentSessions } = await supabase
        .from('feedback_sessions')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        memberCount: membersData?.length || 0,
        sessionCount: sessionsData?.length || 0,
        recentSessions: recentSessions || []
      };
    },
    enabled: !!organization?.id
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                  <p className="text-gray-600">Organization Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" style={{ 
                  backgroundColor: organization.primary_color + '20',
                  color: organization.primary_color 
                }}>
                  {organization.plan_type || 'Free'}
                </Badge>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.memberCount || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Feedback Sessions</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats?.sessionCount || 0}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="text-3xl font-bold text-gray-900">87%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Feedback Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="text-center py-4">Loading recent sessions...</div>
                ) : stats?.recentSessions?.length ? (
                  <div className="space-y-3">
                    {stats.recentSessions.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Session #{session.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No feedback sessions yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <UserManagement 
              organizationId={organization.id}
              organizationName={organization.name}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <OrganizationStats organizationId={organization.id} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={organization.name}
                      className="w-full p-2 border rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Slug
                    </label>
                    <input
                      type="text"
                      value={organization.slug}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: organization.primary_color }}
                        />
                        <span className="text-sm text-gray-600">{organization.primary_color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: organization.secondary_color }}
                        />
                        <span className="text-sm text-gray-600">{organization.secondary_color}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
