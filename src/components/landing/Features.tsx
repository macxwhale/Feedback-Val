
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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to understand your customers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you collect, analyze, and act on customer feedback
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-200 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">
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
