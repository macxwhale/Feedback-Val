
import React from 'react';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumContainer, PremiumSection } from '@/components/ui/premium-layout';
import { HeadingMedium, BodyRegular } from '@/components/ui/enhanced-typography';
import { FeedbackContent } from './FeedbackContent';
import { useOrganizationConfig } from '@/hooks/useOrganizationConfig';

export const EnhancedFeedbackForm: React.FC = () => {
  const { isLoading } = useOrganizationConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-2xl mx-auto animate-bounce" />
          <div className="text-center space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '3s' }} />
      </div>

      <PremiumSection spacing="lg" className="relative z-10">
        <PremiumContainer maxWidth="md">
          <PremiumCard variant="elevated" padding="lg" className="shadow-2xl shadow-gray-200/50 dark:shadow-black/20">
            <div className="text-center mb-8 space-y-3">
              <HeadingMedium>Share Your Experience</HeadingMedium>
              <BodyRegular>
                Your feedback helps us improve our services and better serve our community.
              </BodyRegular>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Secure & Confidential</span>
              </div>
            </div>
            
            <FeedbackContent />
          </PremiumCard>
        </PremiumContainer>
      </PremiumSection>
    </div>
  );
};
