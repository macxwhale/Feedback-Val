
import React from 'react';
import { MessageSquare, BarChart3, Lightbulb, Smile } from 'lucide-react';

const steps = [
  {
    title: "Listen Effortlessly",
    desc: "Collect feedback via beautiful forms and SMS—no tech headaches.",
    icon: <MessageSquare className="h-8 w-8 text-purple-400" />,
  },
  {
    title: "See Patterns Instantly",
    desc: "AI lays out themes and sentiment, surfacing hidden insight.",
    icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Act With Confidence",
    desc: "Dashboards clarify next steps so every team can make change.",
    icon: <Lightbulb className="h-8 w-8 text-orange-400" />,
  },
  {
    title: "Build Loyalty",
    desc: "Close the loop—act faster, show you listen, create true advocates.",
    icon: <Smile className="h-8 w-8 text-amber-400" />,
  },
];

export const HowItWorks: React.FC = () => (
  <section className="py-24 bg-[#f7f8fa] animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
          How Pulselify Works
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          From first signal to loyal superfans—one seamless, modern journey
        </p>
      </div>
      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white/80 rounded-2xl shadow-md backdrop-blur-md px-6 py-10 text-center flex flex-col items-center animate-fade-in"
            style={{ animationDelay: `${0.09 * idx}s` }}
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
            <p className="text-gray-500 text-base">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
