
import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HeroLeft } from "./HeroLeft";
import { HeroRight } from "./HeroRight";
import { CompanyLogosSection } from "./CompanyLogosSection";
import { StatsBar } from "./StatsBar";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { InteractiveDemo } from "./InteractiveDemo";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialSection } from "./TestimonialSection";
import { BoldCTA } from "./BoldCTA";
import { FaqSection } from "./FaqSection";

export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white text-gray-800">
    <Header />

    {/* Hero */}
    <section className="flex flex-col-reverse md:flex-row max-w-7xl mx-auto min-h-[80vh] px-4 pt-32 pb-16 md:pt-32 md:pb-0 gap-7 items-center">
      <div className="w-full md:w-1/2">
        <HeroLeft />
      </div>
      <div className="w-full md:w-1/2">
        <HeroRight />
      </div>
    </section>
    {/* Social Proof */}
    <StatsBar />
    <CompanyLogosSection />

    {/* Problem & Solution */}
    <ProblemSection />
    <SolutionSection />

    {/* Demo */}
    <InteractiveDemo />

    {/* Features (emotion-first) */}
    <FeaturesSection />

    {/* Testimonials */}
    <TestimonialSection />

    {/* CTA */}
    <BoldCTA />

    {/* FAQ */}
    <FaqSection />

    <Footer />
  </div>
);
