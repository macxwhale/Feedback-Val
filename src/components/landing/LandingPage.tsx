
import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { DashboardPreview } from './DashboardPreview';
import { Features } from './Features';
import { SocialProof } from './SocialProof';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fbfaf7] via-[#f5f8f9] to-[#f7f8fa] text-gray-800">
    <Header />
    <Hero />
    <HowItWorks />
    <DashboardPreview />
    <Features />
    <SocialProof />
    <FinalCTA />
    <Footer />
  </div>
);
