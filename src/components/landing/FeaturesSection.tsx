
import React from "react";
import { Star, Users, Info, Check } from "lucide-react";

const benefitBlocks = [
  {
    icon: <Info className="h-6 w-6 text-blue-500" />,
    title: "Know what customers feel",
    points: [
      "Sentiment & emotion detection on every response",
      "Tagging for urgency and trending topics"
    ]
  },
  {
    icon: <Star className="h-6 w-6 text-purple-500" />,
    title: "Improve loyalty",
    points: [
      "Close the loop in real time",
      "Personalized thank-yous & follow-ups",
    ]
  },
  {
    icon: <Users className="h-6 w-6 text-green-500" />,
    title: "Boost service quality",
    points: [
      "Share live dashboards with your team",
      "Actionable alerts—never miss a customer need"
    ]
  }
];

export const FeaturesSection: React.FC = () => (
  <section className="w-full py-20 bg-gradient-to-b from-white to-blue-50">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-10 text-center">Designed for Emotional Connection & Growth</h2>
      <div className="grid md:grid-cols-3 gap-7">
        {benefitBlocks.map((b, idx) => (
          <div key={idx} className="rounded-2xl bg-white/80 hover:bg-green-50 border border-blue-100 shadow-md px-7 py-8 flex flex-col items-center text-center transition animate-fade-in">
            <div className="mb-2">{b.icon}</div>
            <div className="text-lg font-semibold mb-2">{b.title}</div>
            <ul className="space-y-2 text-gray-600 text-left mt-2">
              {b.points.map((point, i) => (
                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
)
