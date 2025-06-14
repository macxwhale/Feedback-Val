
import React from 'react';
import { ModernHeader } from './ModernHeader';
import { ModernHero } from './ModernHero';
import { HowItWorks } from './HowItWorks';
import { DashboardPreview } from './DashboardPreview';
import { Features } from './Features';
import { SocialProof } from './SocialProof';
import { Pricing } from './Pricing';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ModernHeader />
      <ModernHero />
      <HowItWorks />
      <DashboardPreview />
      <Features />
      <SocialProof />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
};
