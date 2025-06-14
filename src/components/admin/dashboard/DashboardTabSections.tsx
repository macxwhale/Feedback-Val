
import { Users, MessageSquare, BarChart3, Settings, TrendingUp, Brain } from 'lucide-react';

export type DashboardTabSection = {
  label: string;
  tabs: {
    id: string;
    label: string;
    icon: any; // lucide icon component
  }[];
};

export const tabSections: DashboardTabSection[] = [
  {
    label: 'Core Analytics',
    tabs: [
      { id: 'overview', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    label: 'Customer Intelligence',
    tabs: [
      { id: 'customer-insights', label: 'Customer Insights', icon: TrendingUp },
      { id: 'sentiment', label: 'Sentiment Analysis', icon: Brain },
      { id: 'performance', label: 'Performance', icon: BarChart3 }
    ]
  },
  {
    label: 'Content Management',
    tabs: [
      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
      { id: 'questions', label: 'Questions', icon: MessageSquare }
    ]
  },
  {
    label: 'Team & Settings',
    tabs: [
      { id: 'members', label: 'Members', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  },
];
