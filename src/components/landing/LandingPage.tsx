
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { HeroLeft } from './HeroLeft';
import { HeroRight } from './HeroRight';
import { CompanyLogosSection } from './CompanyLogosSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { InteractiveDemo } from './InteractiveDemo';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialSection } from './TestimonialSection';
import { BoldCTA } from './BoldCTA';

export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fbfaf7] via-[#f5f8f9] to-[#f7f8fa] text-gray-800">
    <Header />
    {/* HERO - Split layout */}
    <section className="flex flex-col md:flex-row max-w-7xl mx-auto min-h-[75vh] px-4 pt-28 mb-14 gap-5 items-center">
      <div className="w-full md:w-1/2"><HeroLeft /></div>
      <div className="w-full md:w-1/2"><HeroRight /></div>
    </section>
    <CompanyLogosSection />
    <ProblemSection />
    <SolutionSection />
    <InteractiveDemo />
    <FeaturesSection />
    <TestimonialSection />
    <BoldCTA />
    <Footer />
  </div>
);
