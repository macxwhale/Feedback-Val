
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield 
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Channel Feedback",
      description: "Collect insights via forms, SMS, and QR codes in one unified platform"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "AI-powered sentiment analysis and categorization for actionable insights"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-Time Dashboards",
      description: "Beautiful, intuitive dashboards that turn data into decisions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share insights across teams with role-based access controls"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Alerts",
      description: "Get notified immediately when feedback requires attention"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data encryption"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-space font-bold text-warm-gray-900 mb-6">
            Everything you need to understand your customers
          </h2>
          <p className="text-xl text-warm-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to help you collect, analyze, and act on customer feedback
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg shadow-warm-gray-900/5 hover:shadow-xl hover:shadow-warm-gray-900/10 transition-all duration-300 group bg-white">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sunset-500 to-coral-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sunset-500/25">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-space font-semibold text-warm-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-warm-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
