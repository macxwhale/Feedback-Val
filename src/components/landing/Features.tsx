import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { HeartHandshake, Zap, ShieldCheck, Users2, Compass, Tag } from 'lucide-react';

const features = [
  {
    icon: <HeartHandshake className="h-7 w-7 text-blue-500" />,
    title: "Effortless Collection",
    description: "Launch forms or SMS feedback in minutes—no setup stress for you or your team.",
  },
  {
    icon: <Compass className="h-7 w-7 text-purple-400" />,
    title: "Live Insights",
    description: "See answers transformed into themes and sentiment, live, no manual work.",
  },
  {
    icon: <Tag className="h-7 w-7 text-orange-400" />,
    title: "Smart Analysis",
    description: "Drill into every comment with tags, sentiment, and trends—powered by AI.",
  },
  {
    icon: <Zap className="h-7 w-7 text-amber-400" />,
    title: "Instant Alerts",
    description: "Stay proactive, handle issues early, celebrate wins together. Never miss a beat.",
  },
  {
    icon: <Users2 className="h-7 w-7 text-blue-400" />,
    title: "Unified Team Spaces",
    description: "Share dashboards securely, get everyone aligned. Roles, permissions, and peace of mind.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-gray-400" />,
    title: "Security & Trust",
    description: "Enterprise-grade security as standard, with full compliance and encryption.",
  },
];

export const Features: React.FC = () => (
  <section className="py-24 bg-gradient-to-b from-[#f6f8fb] to-white animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why teams choose Pulselify</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Calm, complete clarity—designed for trust, action, and connection.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {features.map((feature, idx) => (
          <Card key={idx} className="border-0 shadow hover:shadow-xl shadow-indigo-100 rounded-2xl group hover:scale-105 transition-all bg-[#f9f9fd] hover:bg-white animate-fade-in">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 flex items-center justify-center mb-2 bg-gradient-to-br from-white to-blue-100 rounded-2xl group-hover:from-blue-50 group-hover:to-orange-50 transition">
                {feature.icon}
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-500">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
)
