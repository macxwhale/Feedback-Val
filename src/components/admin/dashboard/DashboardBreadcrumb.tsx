
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Building, LayoutDashboard } from 'lucide-react';

interface DashboardBreadcrumbProps {
  organizationName: string;
  currentPage?: string;
}

export const DashboardBreadcrumb: React.FC<DashboardBreadcrumbProps> = ({ 
  organizationName,
  currentPage = "Overview"
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="/admin" 
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <Building className="w-4 h-4 mr-1.5" />
            {organizationName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-gray-900 font-semibold">{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
