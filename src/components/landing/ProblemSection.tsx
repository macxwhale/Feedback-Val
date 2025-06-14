
import React from "react";

const painPoints = [
  "Your team is in the dark about what upsets customers",
  "Feedback gets lost in emails or spreadsheets",
  "You react too late—and lose buyers you could have saved",
  "Reports are confusing, so no one takes action"
];

export const ProblemSection: React.FC = () => (
  <section className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 tracking-tight text-center">
        The Cost of Silence: Why Feedback Gaps Hurt Growth
      </h2>
      <ul className="space-y-6">
        {painPoints.map((p, i) => (
          <li key={i} className="flex items-center gap-4 text-lg text-gray-700">
            <span className="block bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center font-bold">{i+1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
