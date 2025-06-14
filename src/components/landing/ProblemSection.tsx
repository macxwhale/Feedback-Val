
import React from "react";

const painPoints = [
  "Scattered feedback lost in email chains",
  "Generic dashboards hide what's really going on",
  "Teams guessing what matters most",
  "Customers feel unheard or neglected"
];

export const ProblemSection: React.FC = () => (
  <section className="w-full bg-gradient-to-br from-[#e9e6fa] via-white to-[#f8eeeb] py-24">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        The Modern Feedback Problem
      </h2>
      <ul className="space-y-4">
        {painPoints.map((p, i) => (
          <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
            <span className="block bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center font-bold">{i+1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
