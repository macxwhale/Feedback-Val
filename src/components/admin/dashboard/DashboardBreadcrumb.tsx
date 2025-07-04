
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

interface DashboardBreadcrumbProps {
  organizationName: string;
  organizationSlug: string;
  activeTab: string;
}

export const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({
  organizationName,
  organizationSlug,
  activeTab
}) => {
  const getTabDisplayName = (tab: string) => {
    const tabNames: Record<string, string> = {
      overview: 'Analytics',
      members: 'Members',
      feedback: 'Feedback',
      questions: 'Questions',
      settings: 'Settings',
      integrations: 'Integrations',
      sentiment: 'Sentiment',
      performance: 'Performance',
      'customer-insights': 'Customer Insights'
    };
    return tabNames[tab] || tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/admin/${organizationSlug}`} className="text-gray-500 hover:text-gray-700 transition-colors">
            {organizationName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-gray-900 font-medium">
            {getTabDisplayName(activeTab)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
