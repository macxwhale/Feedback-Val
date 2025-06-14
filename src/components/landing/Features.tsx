
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
import { FluidBackground } from './FluidBackground';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Multi-Channel Feedback",
      description: "Collect insights via forms, SMS, and QR codes in one unified platform with seamless integration",
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Smart Analytics",
      description: "AI-powered sentiment analysis and categorization for actionable insights that drive growth",
      gradient: "from-coral-500 to-golden-400"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-Time Dashboards",
      description: "Beautiful, intuitive dashboards that turn complex data into clear, actionable decisions",
      gradient: "from-golden-400 to-sunset-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Share insights across teams with advanced role-based access controls and permissions",
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Alerts",
      description: "Get notified immediately when feedback requires attention with intelligent prioritization",
      gradient: "from-coral-500 to-golden-400"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance, end-to-end encryption, and data protection",
      gradient: "from-golden-400 to-sunset-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-white via-warm-gray-50 to-sunset-50/20 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      {/* Fluid Background */}
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <Zap className="w-6 h-6 text-sunset-500" />
            <span className="text-lg font-space font-medium">Everything You Need</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Everything you need to{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                understand
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}your customers
          </h2>
          
          <p className="text-2xl lg:text-3xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Powerful features designed to help you collect, analyze, and act on{' '}
            <span className="text-sunset-600 dark:text-sunset-400 font-semibold">customer feedback</span>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl shadow-warm-gray-900/5 dark:shadow-dark-warm-50/20 hover:shadow-2xl hover:shadow-warm-gray-900/10 dark:hover:shadow-dark-warm-50/30 transition-all duration-500 group bg-white/80 dark:bg-dark-warm-100/80 backdrop-blur-sm hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-sunset-500/30`}>
                    {feature.icon}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-20 animate-pulse-gentle`}></div>
                </div>
                
                <CardTitle className="text-2xl lg:text-3xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-warm-gray-600 dark:text-dark-warm-600 text-lg leading-relaxed font-medium">
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
