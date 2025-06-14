
import React from "react";

// Simple layered SVG wave with soft gradients, animating on load
export const HeroVisual: React.FC = () => (
  <div className="mx-auto w-full max-w-2xl relative z-10 flex justify-center items-center mt-10 mb-2 pointer-events-none">
    <svg
      viewBox="0 0 600 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-40 md:h-56 animate-fade-in"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wave1" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#e9edfa" />
          <stop offset="1" stopColor="#ede9f5" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#bcd7f9" />
          <stop offset="1" stopColor="#eceffd" />
        </linearGradient>
      </defs>
      <path
        d="M0 98C77 130 169 110 314 106C454 101 519 163 600 138V180H0V98Z"
        fill="url(#wave1)"
        opacity="0.92"
      />
      <path
        d="M0 120C65 150 195 141 304 133C417 125 505 177 600 163V180H0V120Z"
        fill="url(#wave2)"
        opacity="0.8"
      />
    </svg>
  </div>
);
