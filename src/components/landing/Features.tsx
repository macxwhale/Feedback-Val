
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { HeartHandshake, Zap, ShieldCheck, Users2, Compass, Tag } from 'lucide-react';

const features = [
  {
    icon: <HeartHandshake className="h-6 w-6 text-blue-500" />,
    title: "Effortless Collection",
    description: "Get started in minutes via SMS and web forms—accessible for everyone."
  },
  {
    icon: <Compass className="h-6 w-6 text-purple-400" />,
    title: "Real-Time Clarity",
    description: "AI-powered dashboards show you the why behind each response instantly."
  },
  {
    icon: <Tag className="h-6 w-6 text-orange-400" />,
    title: "Text & Sentiment Analysis",
    description: "Drill into comments by tag, sentiment, or topic to uncover actionable themes."
  },
  {
    icon: <Zap className="h-6 w-6 text-amber-400" />,
    title: "Instant Alerts",
    description: "Get notified when things change or an unhappy customer needs attention."
  },
  {
    icon: <Users2 className="h-6 w-6 text-blue-400" />,
    title: "Team Collaboration",
    description: "Share insights securely across your business. Role-based access with ease."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-gray-400" />,
    title: "Enterprise-Grade Security",
    description: "Your data is protected with industry-leading compliance and encryption."
  }
];

export const Features: React.FC = () => (
  <section className="py-24 bg-gradient-to-b from-[#fbfaf7] to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Calm, Complete Feature Set
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Everything you need to listen deeply, act wisely, and grow confidently—all in one place.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {features.map((feature, idx) => (
          <Card key={idx} className="border-0 shadow-md rounded-2xl group hover:scale-105 hover:shadow-xl transition-all bg-[#f7f8fa] hover:bg-white">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 flex items-center justify-center mb-3 bg-white rounded-full shadow group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-orange-50 transition">
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
