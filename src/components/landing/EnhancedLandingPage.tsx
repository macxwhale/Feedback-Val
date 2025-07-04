
import React from 'react';
import { ModernHeader } from './ModernHeader';
import { EnhancedModernHero } from './EnhancedModernHero';
import { HowItWorks } from './HowItWorks';
import { DashboardPreview } from './DashboardPreview';
import { EnhancedFeatures } from './EnhancedFeatures';
import { EnhancedPricing } from './EnhancedPricing';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { TrustBadges } from './TrustBadges';
import { FAQ } from './FAQ';

export const EnhancedLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <ModernHeader />
      <EnhancedModernHero />
      <DashboardPreview />
      <TrustBadges />
      <HowItWorks />
      <EnhancedFeatures />
      <EnhancedPricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};
