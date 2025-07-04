
import React, { memo } from 'react';
import { DesignText, DesignCard, DesignContainer, spacing } from '@/components/ui/design-system';
import { DashboardTabs } from './DashboardTabs';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { OrganizationStats } from '@/types/organizationStats';

interface EnhancedDashboardLayoutProps {
  organizationName: string;
  organizationId: string;
  organizationSlug: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: OrganizationStats | null;
  isLoading: boolean;
  children: React.ReactNode;
}

export const EnhancedDashboardLayout = memo<EnhancedDashboardLayoutProps>(({
  organizationName,
  organizationId,
  organizationSlug,
  activeTab,
  onTabChange,
  stats,
  isLoading,
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DesignContainer size="xl" className="py-8">
        {/* Enhanced Header */}
        <div className={spacing.section}>
          <DesignCard padding="lg" shadow="sm" className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DesignText.Heading1 className="mb-2">
                  {organizationName}
                </DesignText.Heading1>
                <DesignText.Body>
                  Organization dashboard and analytics
                </DesignText.Body>
              </div>
              <div className="text-right">
                <DesignText.Caption>
                  Organization ID: {organizationSlug}
                </DesignText.Caption>
              </div>
            </div>
          </DesignCard>

          {/* Navigation Tabs */}
          <DesignCard padding="sm" shadow="none" border={false} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <DashboardTabs
              activeTab={activeTab}
              organizationId={organizationId}
            />
          </DesignCard>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {children}
        </div>
      </DesignContainer>
    </div>
  );
});

EnhancedDashboardLayout.displayName = 'EnhancedDashboardLayout';
