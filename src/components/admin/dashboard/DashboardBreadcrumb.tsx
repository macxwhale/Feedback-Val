
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Building, LayoutDashboard, ChevronRight } from 'lucide-react';

interface DashboardBreadcrumbProps {
  organizationName: string;
  currentPage?: string;
}

export const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({ 
  organizationName,
  currentPage = "Overview"
}) => {
  const getPageTitle = (page: string) => {
    const titles = {
      'overview': 'Analytics Overview',
      'members': 'Team Members',
      'feedback': 'Customer Feedback',
      'questions': 'Question Management',
      'settings': 'Organization Settings',
      'integrations': 'Integrations',
      'sentiment': 'Sentiment Analysis',
      'performance': 'Performance Analytics',
      'customer-insights': 'Customer Insights'
    };
    return titles[page as keyof typeof titles] || page;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="/admin" 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
            <Building className="w-4 h-4 mr-2" />
            {organizationName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-gray-900 font-semibold">
            {getPageTitle(currentPage)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
