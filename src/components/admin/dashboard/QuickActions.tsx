
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  Download, 
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

interface QuickActionsProps {
  onCreateQuestion: () => void;
  onInviteUser: () => void;
  onExportData: () => void;
  onViewSettings: () => void;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  variant: 'default' | 'outline' | 'secondary';
  isPrimary?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateQuestion,
  onInviteUser,
  onExportData,
  onViewSettings
}) => {
  const actions: QuickAction[] = [
    {
      title: 'Create Question',
      description: 'Add a new feedback question to your forms',
      icon: Plus,
      onClick: onCreateQuestion,
      variant: 'default',
      isPrimary: true
    },
    {
      title: 'Invite Member',
      description: 'Add team members to your organization',
      icon: Users,
      onClick: onInviteUser,
      variant: 'outline'
    },
    {
      title: 'Export Data',
      description: 'Download feedback data and analytics',
      icon: Download,
      onClick: onExportData,
      variant: 'outline'
    },
    {
      title: 'Settings',
      description: 'Configure organization preferences',
      icon: Settings,
      onClick: onViewSettings,
      variant: 'outline'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2" />
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
                className={`h-auto p-4 flex flex-col items-start space-y-2 text-left ${
                  action.isPrimary ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs opacity-70 text-left">
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
