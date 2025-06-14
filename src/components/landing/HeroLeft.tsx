
import React from "react";
import { Badge } from "@/components/ui/badge";

export const HeroLeft: React.FC = () => (
  <div className="flex flex-col items-start justify-center pr-6 pt-12 md:pt-0 animate-fade-in">
    <Badge className="bg-black/5 text-blue-600 px-4 shadow mb-6 font-medium tracking-wide backdrop-blur-xl">Trusted by 2,000+ teams</Badge>
    <h1 className="font-bold text-5xl md:text-6xl leading-tight mb-6 text-gray-900">
      Transform Feedback<br />
      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-orange-300 bg-clip-text text-transparent">Into Superfans</span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg">
      Pulselify helps teams move from scattered signals to actionable insights—grow, retain, and build trust through beautiful, modern feedback.
    </p>
    <div className="flex gap-4">
      {/* Primary CTA */}
      <button
        onClick={() => window.location.assign('/auth')}
        className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white px-8 py-4 rounded-full shadow-lg hover:brightness-110 hover:scale-105 font-semibold text-lg transition"
      >Get Started Free</button>
      {/* Secondary CTA */}
      <button
        onClick={() => window.scrollTo({top: 1400, behavior: "smooth"})}
        className="bg-white text-blue-700 px-8 py-4 rounded-full border border-blue-200 hover:bg-blue-50 font-semibold text-lg transition"
      >Live Demo</button>
    </div>
    <div className="text-gray-400 text-xs mt-8">
      No credit card required &nbsp;•&nbsp; Set up in minutes &nbsp;•&nbsp; Personal onboarding
    </div>
  </div>
)
