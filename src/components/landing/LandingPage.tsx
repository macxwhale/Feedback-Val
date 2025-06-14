
import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
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
      <Header />
      <Hero />
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
