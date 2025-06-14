
import React from "react";
import { Compass, HeartHandshake, Tag, Users2, ShieldCheck, Zap } from "lucide-react";

// Feature “story chapters”
const storyFeatures = [
  {
    icon: <HeartHandshake className="h-7 w-7 text-blue-600" />,
    title: "Effortless Launch",
    desc: "Publish a feedback form or SMS journey in minutes. No code, no chaos."
  },
  {
    icon: <Compass className="h-7 w-7 text-purple-500" />,
    title: "Live, Human Insights",
    desc: "Answers become themes & emotion—clarity for every team, live."
  },
  {
    icon: <Tag className="h-7 w-7 text-orange-500" />,
    title: "AI Tagging & Trends",
    desc: "Every comment tagged, categorized, and surfaced—powered by leading AI."
  },
  {
    icon: <Zap className="h-7 w-7 text-amber-500" />,
    title: "Proactive Alerts",
    desc: "Instant notifications help celebrate wins or fix issues—before they snowball."
  },
  {
    icon: <Users2 className="h-7 w-7 text-blue-400" />,
    title: "Everyone on the Same Page",
    desc: "Role-based dashboards, team collaboration, and simple, secure sharing."
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-gray-500" />,
    title: "Built On Trust",
    desc: "Enterprise-grade security, privacy, and reliability from day one."
  }
];

export const FeaturesSection: React.FC = () => (
  <section className="w-full py-24 bg-gradient-to-b from-[#f8fafc] via-white to-[#f5f5fd]">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-14">
        {storyFeatures.map((f, idx) => (
          <div key={f.title}
            className={`flex items-start gap-4 rounded-xl p-6 bg-white/80 shadow hover:scale-105 hover:shadow-xl transition md:col-span-1 ${idx % 2 === 0 ? "animate-fade-in" : "animate-scale-in"}`}
            style={{ animationDelay: `${idx*0.07 + 0.05}s` }}>
            <span>{f.icon}</span>
            <div>
              <div className="font-semibold text-lg mb-1 text-gray-900">{f.title}</div>
              <div className="text-gray-700">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
