
import React from "react";

// Abstract warm dashboard/analytics illustration with animated pulse highlight
export const HeroImage: React.FC = () => (
  <div className="relative w-full max-w-lg mx-auto flex justify-center items-center">
    {/* Decorative pulse shape */}
    <span
      className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-2/3 w-60 h-60 bg-golden-yellow blur-2xl rounded-full opacity-30 pointer-events-none z-0"
      style={{
        filter: "blur(56px)",
        animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }}
      aria-hidden="true"
    ></span>
    {/* Inset pulse */}
    <span className="absolute left-12 top-14 w-32 h-32 bg-warm-coral rounded-full blur-3xl opacity-20 z-0"></span>
    {/* Dashboard image or SVG */}
    <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-golden-yellow bg-white/[0.97] z-10 w-full aspect-[16/10] flex items-center justify-center">
      <img
        src="/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png"
        alt="Pulsify dashboard preview"
        className="object-cover w-full h-full animate-fade-in"
        loading="eager"
        draggable={false}
        style={{ maxHeight: "340px", minHeight: "170px" }}
      />
    </div>
    {/* Subtle orange gradient overlay on mobile */}
    <span className="absolute bottom-0 right-0 w-28 h-28 bg-sunset-orange opacity-10 rounded-full z-0 blur-3xl"></span>
  </div>
);
