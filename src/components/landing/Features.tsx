
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  ArrowRight
} from 'lucide-react';
import { FluidBackground } from './FluidBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const problems = [
    {
      problem: "Lost customers due to poor experiences",
      solution: "Get real-time alerts when issues arise",
      icon: <Users className="h-8 w-8" />,
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      problem: "Making decisions without customer insights",
      solution: "AI-powered analytics reveal hidden patterns",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-coral-500 to-golden-400"
    },
    {
      problem: "Scattered feedback across multiple channels",
      solution: "Unified platform for all customer touchpoints",
      icon: <MessageSquare className="h-8 w-8" />,
      gradient: "from-golden-400 to-sunset-500"
    }
  ];

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Multi-Channel Collection",
      description: "Forms, SMS, QR codes - collect feedback everywhere customers are",
      gradient: "from-sunset-500 to-coral-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Automatic sentiment analysis and categorization for instant insights",
      gradient: "from-coral-500 to-golden-400"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-Time Alerts",
      description: "Get notified immediately when feedback requires urgent attention",
      gradient: "from-golden-400 to-sunset-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and data protection",
      gradient: "from-sunset-500 to-coral-500"
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-white via-warm-gray-50 to-sunset-50/20 dark:from-dark-warm-50 dark:via-dark-warm-100 dark:to-dark-warm-50 overflow-hidden">
      <FluidBackground />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WHY - Problems it solves */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-warm-gray-600 dark:text-dark-warm-600 mb-8">
            <TrendingUp className="w-6 h-6 text-sunset-500" />
            <span className="text-lg font-space font-medium">Why It Matters</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-space font-black text-warm-gray-900 dark:text-dark-warm-900 mb-8 leading-tight">
            Stop losing{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 bg-clip-text text-transparent">
                customers
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 rounded-full animate-scale-in"></div>
            </span>
            {' '}to poor experiences
          </h2>
          
          <p className="text-xl lg:text-2xl text-warm-gray-600 dark:text-dark-warm-600 max-w-4xl mx-auto leading-relaxed font-medium mb-16">
            Without proper feedback management, businesses miss critical insights that could prevent customer churn and drive growth
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {problems.map((item, index) => (
              <div key={index} className="bg-white/80 dark:bg-dark-warm-100/80 backdrop-blur-sm rounded-3xl p-8 border border-warm-gray-200/50 dark:border-dark-warm-300/50 group hover:scale-105 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="text-lg font-space font-bold text-red-600 dark:text-red-400 mb-4">
                  Problem: {item.problem}
                </div>
                <div className="text-lg font-space font-semibold text-green-600 dark:text-green-400">
                  Solution: {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 mb-8">
            Powerful features that make the difference
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl shadow-warm-gray-900/5 dark:shadow-dark-warm-50/20 hover:shadow-2xl hover:shadow-warm-gray-900/10 dark:hover:shadow-dark-warm-50/30 transition-all duration-500 group bg-white/80 dark:bg-dark-warm-100/80 backdrop-blur-sm hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6 pt-8">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-sunset-500/30`}>
                    {feature.icon}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-20 animate-pulse-gentle`}></div>
                </div>
                
                <CardTitle className="text-xl lg:text-2xl font-space font-bold text-warm-gray-900 dark:text-dark-warm-900 leading-tight">
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

        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-sunset-500 via-coral-500 to-golden-400 hover:from-sunset-600 hover:via-coral-600 hover:to-golden-500 text-white font-space font-bold text-lg px-12 py-6 rounded-full shadow-xl shadow-sunset-500/30 hover:shadow-2xl hover:shadow-sunset-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <span className="flex items-center">
              See All Features
              <ArrowRight className="ml-3 h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
