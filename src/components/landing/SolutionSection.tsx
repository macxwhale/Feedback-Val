
import React from "react";

const steps = [
  { title: "Collect Every Voice", desc: "Easy forms & SMS, branded for trust—no more missing signals." },
  { title: "AI Clarity in Seconds", desc: "Instant themes, trends, and emotional tone—straight to your dashboard." },
  { title: "Take Action, Close the Loop", desc: "Assign feedback to teams, track resolution, and celebrate happier customers." },
];

export const SolutionSection: React.FC = () => (
  <section className="w-full bg-gradient-to-br from-white via-green-50 to-blue-50 py-20">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 tracking-tight text-center">
        Pulselify Bridges the Gap—With Empathy and Speed
      </h2>
      <div className="space-y-12">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-6 items-start">
            <span className={`inline-block w-7 h-7 rounded-full font-bold flex items-center justify-center shadow-md ${i === 0 ? "bg-blue-200 text-blue-700" : i === 1 ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{i+1}</span>
            <div>
              <div className="text-xl font-semibold text-gray-900">{s.title}</div>
              <div className="text-gray-700">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
