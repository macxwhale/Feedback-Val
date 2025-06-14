
import React from 'react';
import { ModernHeader } from './ModernHeader';
import { ModernHero } from './ModernHero';
import { HowItWorks } from './HowItWorks';
import { DashboardPreview } from './DashboardPreview';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      <ModernHeader />
      <ModernHero />
      <HowItWorks />
      <DashboardPreview />
      <Features />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
};
