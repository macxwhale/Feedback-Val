
import React from "react";
import { Badge } from "@/components/ui/badge";

export const HeroLeft: React.FC = () => (
  <div className="flex flex-col items-start justify-center pr-6 pt-6 md:pt-0 animate-fade-in">
    <Badge className="bg-blue-100 text-blue-600 px-5 shadow mb-6 font-medium tracking-wide backdrop-blur-xl">The missing feedback engine for modern business</Badge>
    <h1 className="font-bold text-4xl md:text-6xl leading-tight mb-7 text-gray-900">
      Stop guessing.<br />
      <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Hear every signal, turn feedback into growth</span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-lg">
      When customer needs are invisible, you miss retention and revenue. Pulselify reveals what matters—helping you act fast, delight more customers, and build a business they love.
    </p>
    <div className="flex gap-4">
      {/* Primary CTA */}
      <button
        onClick={() => window.location.assign('/auth')}
        className="bg-gradient-to-r from-blue-600 via-green-400 to-purple-400 text-white px-8 py-4 rounded-full shadow-lg hover:brightness-110 hover:scale-105 font-semibold text-lg transition"
      >Start Free Trial</button>
      {/* Secondary CTA */}
      <button
        onClick={() => window.scrollTo({top: 1400, behavior: "smooth"})}
        className="bg-white text-blue-700 px-8 py-4 rounded-full border border-blue-200 hover:bg-blue-50 font-semibold text-lg transition"
      >Book Demo</button>
    </div>
    <div className="text-gray-400 text-xs mt-8">
      No credit card • 14-day trial • Personal onboarding
    </div>
  </div>
)
