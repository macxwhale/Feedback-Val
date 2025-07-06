
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Settings, Users, MessageSquare, BarChart3 } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  onClick: () => void;
}

interface QuickActionPanelProps {
  onTabChange: (tab: string) => void;
  stats?: any;
}

export const QuickActionPanel: React.FC<QuickActionPanelProps> = ({ onTabChange, stats }) => {
  const quickActions: QuickAction[] = [
    {
      id: 'add-members',
      label: 'Invite Members',
      description: 'Add team members to your organization',
      icon: Users,
      badge: stats?.pending_invitations ? `${stats.pending_invitations} pending` : undefined,
      onClick: () => onTabChange('members')
    },
    {
      id: 'add-questions',
      label: 'Create Questions',
      description: 'Add new survey questions',
      icon: MessageSquare,
      onClick: () => onTabChange('questions')
    },
    {
      id: 'view-feedback',
      label: 'Review Feedback',
      description: 'Check latest customer responses',
      icon: BarChart3,
      badge: stats?.unread_responses ? `${stats.unread_responses} new` : undefined,
      onClick: () => onTabChange('feedback')
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Download analytics and reports',
      icon: Download,
      onClick: () => {
        // This would trigger an export dialog
        console.log('Export data clicked');
      }
    },
    {
      id: 'settings',
      label: 'Organization Settings',
      description: 'Manage your organization preferences',
      icon: Settings,
      onClick: () => onTabChange('settings')
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-orange-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 bg-white hover:bg-orange-50 hover:border-orange-200 transition-colors"
              onClick={action.onClick}
            >
              <div className="flex items-center justify-between w-full">
                <action.icon className="w-5 h-5 text-orange-600" />
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-gray-900">{action.label}</div>
                <div className="text-xs text-gray-600 mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
