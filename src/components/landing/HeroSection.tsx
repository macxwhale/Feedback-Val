
import React from "react";
import { PulseIcon } from "./PulseIcon";
import { HeroButtons } from "./HeroButtons";
import { HeroImage } from "./HeroImage";

export const HeroSection: React.FC = () => (
  <section
    className="relative bg-[#FCFAF7] min-h-[80vh] w-full flex items-center py-12 md:py-20 overflow-hidden border-b border-slate-100"
    style={{ boxShadow: "0 2px 32px 0 #FF6B3510" }}
  >
    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 px-4 sm:px-8">
      {/* Left: Text Block */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-2 mb-4">
          <PulseIcon size={54} className="drop-shadow-lg" />
          <h1 className="ml-2 text-4xl sm:text-5xl font-bold font-space-grotesk tracking-tight text-slate-dark"
            style={{
              letterSpacing: "-0.02em",
              lineHeight: "1.07"
            }}
          >
            Pulsify
          </h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-medium font-space-grotesk mb-6 text-slate-dark max-w-lg leading-relaxed">
          Empower Your Business with Customer-Driven Insights
        </h2>
        <p className="text-base sm:text-lg text-gray-700 max-w-xl mb-4 leading-relaxed font-inter">
          Capture authentic feedback in audio, video, or text. Pulsify helps you connect, learn, and act by understanding what really matters—beyond numbers, across the entire experience.
        </p>
        <HeroButtons />
        <div className="mt-5">
          <span className="text-xs text-warm-coral font-medium">Lifetime Deal: One-time payment, unlimited access</span>
        </div>
      </div>
      {/* Right: Visual Block */}
      <div className="flex-1 mt-10 md:mt-0 flex items-center justify-center w-full max-w-lg">
        <HeroImage />
      </div>
    </div>
  </section>
);
