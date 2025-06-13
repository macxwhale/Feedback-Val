
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  Download, 
  Settings,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface QuickActionsProps {
  onCreateQuestion: () => void;
  onInviteUser: () => void;
  onExportData: () => void;
  onViewSettings: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateQuestion,
  onInviteUser,
  onExportData,
  onViewSettings
}) => {
  const actions = [
    {
      title: 'Create Question',
      description: 'Add a new feedback question',
      icon: Plus,
      onClick: onCreateQuestion,
      variant: 'default' as const
    },
    {
      title: 'Invite Member',
      description: 'Add team members',
      icon: Users,
      onClick: onInviteUser,
      variant: 'outline' as const
    },
    {
      title: 'Export Data',
      description: 'Download feedback data',
      icon: Download,
      onClick: onExportData,
      variant: 'outline' as const
    },
    {
      title: 'Settings',
      description: 'Organization settings',
      icon: Settings,
      onClick: onViewSettings,
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                onClick={action.onClick}
                className="h-auto p-4 flex flex-col items-start space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-left opacity-70">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
