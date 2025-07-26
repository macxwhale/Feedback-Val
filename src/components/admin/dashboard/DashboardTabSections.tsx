
import { Users, MessageSquare, BarChart3, Settings, TrendingUp, Brain, Inbox } from 'lucide-react';

export type DashboardTabSection = {
  label: string;
  tabs: {
    id: string;
    label: string;
    icon: any; // lucide icon component
    requiredPermission?: string;
    requiredRole?: string;
    minRoleLevel?: number;
  }[];
};

export const tabSections: DashboardTabSection[] = [
  {
    label: 'Core Analytics',
    tabs: [
      { 
        id: 'overview', 
        label: 'Analytics', 
        icon: BarChart3,
        requiredPermission: 'view_analytics',
        minRoleLevel: 1 // viewer and above
      }
    ]
  },
  {
    label: 'Customer Intelligence',
    tabs: [
      { 
        id: 'customer-insights', 
        label: 'Customer Insights', 
        icon: TrendingUp,
        requiredPermission: 'view_analytics',
        minRoleLevel: 2 // member and above
      },
      { 
        id: 'sentiment', 
        label: 'Sentiment Analysis', 
        icon: Brain,
        requiredPermission: 'view_analytics',
        minRoleLevel: 2 // member and above
      },
      { 
        id: 'performance', 
        label: 'Performance', 
        icon: BarChart3,
        requiredPermission: 'view_analytics',
        minRoleLevel: 2 // member and above
      }
    ]
  },
  {
    label: 'Content Management',
    tabs: [
      { 
        id: 'inbox', 
        label: 'Inbox', 
        icon: Inbox,
        requiredPermission: 'view_analytics',
        minRoleLevel: 1 // viewer and above
      },
      { 
        id: 'feedback', 
        label: 'Feedback Analytics', 
        icon: MessageSquare,
        requiredPermission: 'view_analytics',
        minRoleLevel: 2 // member and above
      },
      { 
        id: 'questions', 
        label: 'Questions', 
        icon: MessageSquare,
        requiredPermission: 'manage_questions',
        minRoleLevel: 3 // analyst and above
      }
    ]
  },
  {
    label: 'Team & Settings',
    tabs: [
      { 
        id: 'members', 
        label: 'Members', 
        icon: Users,
        requiredPermission: 'manage_users',
        minRoleLevel: 4 // manager and above
      },
      { 
        id: 'settings', 
        label: 'Settings', 
        icon: Settings,
        requiredPermission: 'manage_organization',
        minRoleLevel: 5 // admin and above
      }
    ]
  },
];
