
import React from "react";

const solutions = [
  { title: "Immediate Signal Capture", desc: "Gather rich feedback instantly—forms or SMS, beautifully branded, no tech hurdles." },
  { title: "Actionable AI Insights", desc: "Themes, trends, and sentiment surfaced automatically, so teams focus on action—never sifting." },
  { title: "Unified Team Spaces", desc: "Share, align, and empower every team member with clarity and context—no more guesswork." },
  { title: "Superfan Creation Engine", desc: "Close the loop in real-time, act faster, and turn silent buyers into lifetime advocates." }
];

export const SolutionSection: React.FC = () => (
  <section className="w-full bg-gradient-to-br from-[#e8f6f8] via-white to-[#ece9ff] py-24">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        The Pulselify Way
      </h2>
      <div className="space-y-8">
        {solutions.map((sol, i) => (
          <div key={i} className="flex gap-5 items-start">
            <span className="inline-block w-5 h-5 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center">{i+1}</span>
            <div>
              <div className="text-lg font-semibold text-gray-900">{sol.title}</div>
              <div className="text-gray-700">{sol.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
